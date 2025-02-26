import streamDeck, { action, KeyDownEvent, type DidReceiveSettingsEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import * as fs from 'fs/promises';

import WotAccountInfo from "WotAccountInfo";
import WgApiError from "WgApiError";
import { SettingsSchema } from "../plugin";

/**
 * Settings for {@link IncrementCounter}.
 */
type PluginSettings = {
	count?: number;
	account_id: number;
	application_id: string;
	filename: string;
};

@action({ UUID: "com.wlezley-lishack.wot-tracker.increment" })
export class IncrementCounter extends SingletonAction<PluginSettings> {

	override onWillAppear(ev: WillAppearEvent<PluginSettings>): void | Promise<void> {
		return ev.action.setTitle(`${ev.payload.settings.count ?? 'WoT'}`);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<PluginSettings>): void {
		// Handle the settings changing in the property inspector (UI).
		streamDeck.logger.info("SETTINGS CHANGED: ", ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<PluginSettings>): Promise<void> {
		const { settings } = ev.payload;

		const globalSettings = await streamDeck.settings.getGlobalSettings() as SettingsSchema;


		if (settings.application_id && globalSettings.account_id && globalSettings.access_token) {
			const API_URL = `https://api.worldoftanks.eu/wot/account/info/?application_id=${settings.application_id}&account_id=${globalSettings.account_id}&access_token=${globalSettings.access_token}`;

			fetch(API_URL)
				.then(response => response.json())
				.then(data => {
					const apidata = data as WotAccountInfo.ApiResponse | WgApiError.ApiResponse;
					// streamDeck.logger.debug(`API DATA`, apidata);

					if (apidata.status == "ok") {
						if (apidata.data[globalSettings.account_id]) {
							streamDeck.logger.info(`GLOBAL_RATING`, apidata.data[globalSettings.account_id].global_rating);
							streamDeck.logger.info(`TREES_CUT`, apidata.data[globalSettings.account_id].statistics.trees_cut);
							streamDeck.logger.info(`CLAN_ID`, apidata.data[globalSettings.account_id].clan_id);
							streamDeck.logger.info(`CREDITS`, apidata.data[globalSettings.account_id].private.credits);
							streamDeck.logger.info(`GOLD`, apidata.data[globalSettings.account_id].private.gold);
							streamDeck.logger.info(`BONDS`, apidata.data[globalSettings.account_id].private.bonds);
							streamDeck.logger.info(`FREE_XP`, apidata.data[globalSettings.account_id].private.free_xp);

							if (settings.filename) {
								fs.writeFile(settings.filename, apidata.data[globalSettings.account_id].private.credits.toString());
							}
						} else {
							throw "Player not found";
						}
					} else {
						throw apidata.error;
					}
				})
				.catch(error => streamDeck.logger.error("WG API ERROR: ", error));
		} else {
			streamDeck.logger.error("Missing parameters: application_id OR account_id OR access_token");
		}
	}
}
