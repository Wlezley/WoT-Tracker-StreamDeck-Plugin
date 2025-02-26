import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { IncrementCounter } from "./actions/increment-counter";


// LOCALHOST WEBSOCKET AUTH SERVER ---->>
import express, { Request, Response } from "express";

const app = express();
const PORT = 5005;

app.get("/auth", (req: Request, res: Response) => {
    const status = req.query.status as string;
    const accessToken = req.query.access_token as string;
    const nickname = req.query.nickname as string;
    const account_id = req.query.account_id as string | number;
    const expires_at = req.query.expires_at as string | number;

    if (status == "ok" && accessToken && nickname && account_id && expires_at) {
        const authSettings = {
            access_token: accessToken,
            nickname: nickname,
            account_id: account_id,
            expires_at: expires_at
        };
        streamDeck.settings.setGlobalSettings(authSettings);
        streamDeck.logger.info("WG API Auth settings: ", authSettings);
        res.send("<br /><br /><br /><br /><h1><center>Autorizace úspěšná, můžete zavřít tuto stránku.</center></h1>");
    } else {
        res.send("Autorizace selhala, zkuste to znovu.");
    }
});

app.listen(PORT, () => {
    streamDeck.logger.info(`Auth server is up and running at http://localhost:${PORT}`);
});
// <<---- LOCALHOST WEBSOCKET AUTH SERVER


// Property Inspector COMMAND HANDLER ---->>
export type SettingsSchema = {
    command: string;
    application_id: string;
    access_token: string;
    nickname: string;
    account_id: number;
    expires_at: number;
}

streamDeck.settings.onDidReceiveGlobalSettings((ev) => {
    streamDeck.logger.debug(ev.settings);

    const globalSettings = ev.settings as SettingsSchema;

    streamDeck.logger.info("GS: command: ", globalSettings.command);
    streamDeck.logger.info("GS: application_id: ", globalSettings.application_id);

    if (globalSettings.command === "startAuth") {
        const application_id = globalSettings.application_id;
        if (!application_id) {
            streamDeck.logger.error("WG API ID chybí!");
            return;
        }

        const redirectUri = `http://localhost:${PORT}/auth`;
        const authUrl = `https://api.worldoftanks.eu/wot/auth/login/?application_id=${application_id}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        streamDeck.system.openUrl(authUrl);
    }
});
// <<---- Property Inspector COMMAND HANDLER


// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the increment action.
streamDeck.actions.registerAction(new IncrementCounter());

// Finally, connect to the Stream Deck.
streamDeck.connect();
