import { MessageProvider } from '@/services/message-provider'
import { Buffer } from 'buffer';
import {RarimoApproved, RarimoFailed, ServiceLine} from "@/constants/extension";

window.Buffer = Buffer;

const messageProvider = new MessageProvider()
messageProvider.setExtensionId(chrome.runtime.id)

async function replaceTitle() {
  let emailDiv: HTMLDivElement | null

  const replaceTitleOnPage = async () => {
    emailDiv = document.querySelector('div.a3s.aiL')
    if (!emailDiv) return;
    const emailText = emailDiv.textContent

    if (!emailText || !emailText.includes(ServiceLine)) return;

    const proofAndSignalsIndex = emailText!.indexOf(ServiceLine)
    emailDiv.textContent = emailText!.substring(0, proofAndSignalsIndex)

    const proofAndSignals = emailText!
      .substring(proofAndSignalsIndex)
      .replace(ServiceLine, '')
      .replace(" ", "")
      .split(";")

    try {
      const proof = Buffer.from(proofAndSignals[0], 'base64').toString()
      const pubSigs = Buffer.from(proofAndSignals[1], 'base64').toString()

      const oldTitle = emailDiv.textContent

      emailDiv.textContent = `${oldTitle} (Loading...)`
      const isValid = await messageProvider.verifyProof(proof, pubSigs)

      emailDiv.innerHTML = `<div>${oldTitle}</div> ${isValid ? RarimoApproved : RarimoFailed}`
    } catch (e) {
      console.error("Error:", e);
    }
  };

  replaceTitleOnPage();

  const handleDOMContentLoaded = () => {
    replaceTitleOnPage();
  };

  const handleHashChange = () => {
    replaceTitleOnPage();
  };

  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
  window.addEventListener('hashchange', handleHashChange);
}

replaceTitle();
