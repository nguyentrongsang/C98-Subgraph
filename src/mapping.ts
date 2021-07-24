import {
  C98,
  Transfer as TransferEvent
} from "../generated/C98/C98"

import {
  User,
  UserCounter,
  TransferCounter,
  TokenInfo
} from "../generated/schema"

import { BigInt } from '@graphprotocol/graph-ts'

export function handleTransfer(event: TransferEvent): void {
  
  let userFrom = User.load(event.params.from.toHex())
  if (userFrom == null) {
    userFrom = newUser(event.params.from.toHex(), event.params.from.toHex());
  }
  userFrom.balanceGwei = userFrom.balanceGwei - event.params.value
  userFrom.transactionCount = userFrom.transactionCount + 1
  userFrom.save()

  let userTo = User.load(event.params.to.toHex())
  if (userTo == null) {
    userTo = newUser(event.params.to.toHex(), event.params.to.toHex());

    // UserCounter
    let userCounter = UserCounter.load('userCounter')
    if (userCounter == null) {
      userCounter = new UserCounter('userCounter')
      userCounter.count = 1
    } else {
      userCounter.count = userCounter.count + 1
    }
    userCounter.save()
  }
  userTo.balanceGwei = userTo.balanceGwei + event.params.value
  userTo.transactionCount = userTo.transactionCount + 1
  userTo.save()

  // Transfer counter total and historical
  let transferCounter = TransferCounter.load('transferCounter')
  if (transferCounter == null) {
    transferCounter = new TransferCounter('transferCounter')
    transferCounter.count = 0
    transferCounter.totalTransferredGwei = BigInt.fromI32(0)
  }
  transferCounter.count = transferCounter.count + 1
  transferCounter.totalTransferredGwei = transferCounter.totalTransferredGwei + event.params.value
  transferCounter.save()

  let c98Info = TokenInfo.load('info')
  if (c98Info == null) {
    let c98Contract = C98.bind(event.address)
    c98Info = new TokenInfo('info')

    c98Info.name = c98Contract._name
    c98Info.symbol = c98Contract.symbol()
    c98Info.totalSupplyGwei = c98Contract.totalSupply()
    c98Info.save()
  }
}

function newUser(id: string, address: string): User {
  let user = new User(id);
  user.address = address
  user.balanceGwei = BigInt.fromI32(0)
  user.transactionCount = 0
  return user
}