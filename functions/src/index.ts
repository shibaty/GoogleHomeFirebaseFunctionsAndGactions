'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {ActionsSdkApp} from 'actions-on-google';

const NO_INPUTS = [
  "もう一度言ってください"
];

admin.initializeApp(functions.config().firebase);

export const GActionsGateway = functions.https.onRequest((request, response) => {
  const app: ActionsSdkApp = new ActionsSdkApp({request, response});

  const mainIntent = (_app: ActionsSdkApp) => {
    const inputPrompt = _app.buildInputPrompt(false, "ようこそ", NO_INPUTS);
    _app.ask(inputPrompt);
  };

  const rawIntent = (_app: ActionsSdkApp) => {
    const phrase: string = _app.getRawInput();
    if (phrase === "バイバイ") {
      _app.tell("バイバイ");
      return;
    }

    const inputPrompt = _app.buildInputPrompt(false, phrase + "を行います");
    _app.ask(inputPrompt);

    (async () => {

      const db = admin.database();
      const ref = db.ref("assistant");
      await ref.set({
        phrase: phrase,
        update_time: (new Date()).getTime()
      });
    })();
  };

  const actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  actionMap.set(app.StandardIntents.TEXT, rawIntent);

  app.handleRequest(actionMap);
});
