import { Message, MessageType } from '@/constants/extension'

export class MessageProvider {
  public extensionId: string

  constructor () {
    this.extensionId = ''
  }

  setExtensionId (extensionId: string): void {
    this.extensionId = extensionId
  }

  verifyProof (proof: string, pubSigs: string): Promise<unknown> {
    return this.sendMessage({ type: MessageType.verifyProof, proof, pubSigs }, true)
  }

  sendMessage (message: Message, wait = false): Promise<unknown> {
    return new Promise(resolve => {
      return this.extensionId
        ? chrome.runtime.sendMessage(this.extensionId, message, res => {
          if (!wait || res) resolve(res)
        })
        : chrome.runtime.sendMessage(message, resolve)
    })
  }
}
