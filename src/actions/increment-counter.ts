import streamDeck, { action, KeyDownEvent, type DidReceiveSettingsEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import * as fs from 'fs/promises';

import WotAccountInfo from "WotAccountInfo";
import WgApiError from "WgApiError";

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
	count?: number;
	player_id: number;
	wg_api_id: number;
	filename: string;
};

@action({ UUID: "com.wlezley-lishack.wot-tracker.increment" })
export class IncrementCounter extends SingletonAction<CounterSettings> {

	override onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
		return ev.action.setTitle(`${ev.payload.settings.count ?? 0}`);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<CounterSettings>): void {
		// Handle the settings changing in the property inspector (UI).
		streamDeck.logger.info("SETTINGS CHANGED: ", ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		// streamDeck.system.openUrl("https://elgato.com");

		const { settings } = ev.payload;

		// fs.writeFile(settings.filename, "aaaaaa");

		if (settings.player_id && settings.wg_api_id) {
			const API_URL = `https://api.worldoftanks.eu/wot/account/info/?application_id=${settings.wg_api_id}&account_id=${settings.player_id}`;

			fetch(API_URL)
				.then(response => response.json())
				.then(data => {
					const apidata = data as WotAccountInfo.ApiResponse | WgApiError.ApiResponse;
					// streamDeck.logger.debug(`API DATA`, apidata);

					if (apidata.status == "ok") {
						if (apidata.data[settings.player_id]) {
							streamDeck.logger.info(`G_RATING`, apidata.data[settings.player_id].global_rating);
							streamDeck.logger.info(`CLAN`, apidata.data[settings.player_id].clan_id);

							fs.writeFile(settings.filename, apidata.data[settings.player_id].clan_id.toString());
						} else {
							throw "Player not found";
						}
					} else {
						throw apidata.error;
					}
				})
				.catch(error => streamDeck.logger.error("WG API ERROR: ", error));
		} else {
			streamDeck.logger.error("Neni to vyplněný!");
		}
	}
}
