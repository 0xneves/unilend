import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BorrowCollected,
  BorrowCreated,
  LendCreated,
  LendRevoked,
  TokenClaimedBack
} from "../generated/Unilend/Unilend"

export function createBorrowCollectedEvent(
  borrower: Address,
  tokenId: BigInt,
  amount0: BigInt,
  amount1: BigInt
): BorrowCollected {
  let borrowCollectedEvent = changetype<BorrowCollected>(newMockEvent())

  borrowCollectedEvent.parameters = new Array()

  borrowCollectedEvent.parameters.push(
    new ethereum.EventParam("borrower", ethereum.Value.fromAddress(borrower))
  )
  borrowCollectedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  borrowCollectedEvent.parameters.push(
    new ethereum.EventParam(
      "amount0",
      ethereum.Value.fromUnsignedBigInt(amount0)
    )
  )
  borrowCollectedEvent.parameters.push(
    new ethereum.EventParam(
      "amount1",
      ethereum.Value.fromUnsignedBigInt(amount1)
    )
  )

  return borrowCollectedEvent
}

export function createBorrowCreatedEvent(
  lender: Address,
  borrower: Address,
  tokenId: BigInt,
  price: BigInt,
  deadline: BigInt
): BorrowCreated {
  let borrowCreatedEvent = changetype<BorrowCreated>(newMockEvent())

  borrowCreatedEvent.parameters = new Array()

  borrowCreatedEvent.parameters.push(
    new ethereum.EventParam("lender", ethereum.Value.fromAddress(lender))
  )
  borrowCreatedEvent.parameters.push(
    new ethereum.EventParam("borrower", ethereum.Value.fromAddress(borrower))
  )
  borrowCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  borrowCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  borrowCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )

  return borrowCreatedEvent
}

export function createLendCreatedEvent(
  lender: Address,
  tokenId: BigInt,
  price: BigInt,
  time: BigInt
): LendCreated {
  let lendCreatedEvent = changetype<LendCreated>(newMockEvent())

  lendCreatedEvent.parameters = new Array()

  lendCreatedEvent.parameters.push(
    new ethereum.EventParam("lender", ethereum.Value.fromAddress(lender))
  )
  lendCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  lendCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  lendCreatedEvent.parameters.push(
    new ethereum.EventParam("time", ethereum.Value.fromUnsignedBigInt(time))
  )

  return lendCreatedEvent
}

export function createLendRevokedEvent(
  lender: Address,
  tokenId: BigInt
): LendRevoked {
  let lendRevokedEvent = changetype<LendRevoked>(newMockEvent())

  lendRevokedEvent.parameters = new Array()

  lendRevokedEvent.parameters.push(
    new ethereum.EventParam("lender", ethereum.Value.fromAddress(lender))
  )
  lendRevokedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return lendRevokedEvent
}

export function createTokenClaimedBackEvent(
  lender: Address,
  borrower: Address,
  tokenId: BigInt
): TokenClaimedBack {
  let tokenClaimedBackEvent = changetype<TokenClaimedBack>(newMockEvent())

  tokenClaimedBackEvent.parameters = new Array()

  tokenClaimedBackEvent.parameters.push(
    new ethereum.EventParam("lender", ethereum.Value.fromAddress(lender))
  )
  tokenClaimedBackEvent.parameters.push(
    new ethereum.EventParam("borrower", ethereum.Value.fromAddress(borrower))
  )
  tokenClaimedBackEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenClaimedBackEvent
}
