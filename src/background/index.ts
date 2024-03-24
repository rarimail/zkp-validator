import {Message, MessageType} from '@/constants/extension'
import fs from "fs";

function onMessage(
  message: Message,
  _: unknown,
  sendResponse: (payload: unknown) => void,
) {
  const {type, proof, pubSigs} = message
  switch (type) {
    case MessageType.verifyProof:
      fetch('http://localhost:8000/_/api/integrations/rarimail-svc/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            attributes: {
              proof,
              public_signals: JSON.parse(pubSigs!)
            }
          }
        })
      })
        .then(res => {
          sendResponse(res.ok)
        })
        .catch(err => sendResponse(err))

      break
  }

  return true
}

chrome.runtime.onMessage.addListener(onMessage)
chrome.runtime.onMessageExternal.addListener(onMessage)
