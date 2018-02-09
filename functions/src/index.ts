'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

import {ActionsSdkApp} from 'actions-on-google';

const NO_INPUTS = [
  "もう一度言っていただけますか",
  "何か申し付けください"
];

export const GActionsGateway = functions.https.onRequest((request, response) => {
  const app: ActionsSdkApp = new ActionsSdkApp({request, response});

  const mainIntent = (_app: ActionsSdkApp) => {
    const inputPrompt = _app.buildInputPrompt(false, "なんなりと", NO_INPUTS);
    _app.ask(inputPrompt);
  };

  const rawIntent = (_app: ActionsSdkApp) => {
    const phrase: string = _app.getRawInput();
    if (phrase === "結構") {
      _app.tell("失礼します");
      return;
    }

    const inputPrompt = _app.buildInputPrompt(false, "はい", NO_INPUTS);
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
