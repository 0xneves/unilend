import {
  BorrowCollected as BorrowCollectedEvent,
  BorrowCreated as BorrowCreatedEvent,
  LendCreated as LendCreatedEvent,
  LendRevoked as LendRevokedEvent,
  TokenClaimedBack as TokenClaimedBackEvent
} from "../generated/Unilend/Unilend"
import {
  BorrowCollected,
  BorrowCreated,
  LendCreated,
  LendRevoked,
  TokenClaimedBack
} from "../generated/schema"

export function handleBorrowCollected(event: BorrowCollectedEvent): void {
  let entity = new BorrowCollected(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.borrower = event.params.borrower
  entity.tokenId = event.params.tokenId
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBorrowCreated(event: BorrowCreatedEvent): void {
  let entity = new BorrowCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lender = event.params.lender
  entity.borrower = event.params.borrower
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price
  entity.deadline = event.params.deadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLendCreated(event: LendCreatedEvent): void {
  let entity = new LendCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lender = event.params.lender
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price
  entity.time = event.params.time

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLendRevoked(event: LendRevokedEvent): void {
  let entity = new LendRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lender = event.params.lender
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenClaimedBack(event: TokenClaimedBackEvent): void {
  let entity = new TokenClaimedBack(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lender = event.params.lender
  entity.borrower = event.params.borrower
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
