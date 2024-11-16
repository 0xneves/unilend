import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { BorrowCollected } from "../generated/schema"
import { BorrowCollected as BorrowCollectedEvent } from "../generated/Unilend/Unilend"
import { handleBorrowCollected } from "../src/unilend"
import { createBorrowCollectedEvent } from "./unilend-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let borrower = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let amount0 = BigInt.fromI32(234)
    let amount1 = BigInt.fromI32(234)
    let newBorrowCollectedEvent = createBorrowCollectedEvent(
      borrower,
      tokenId,
      amount0,
      amount1
    )
    handleBorrowCollected(newBorrowCollectedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BorrowCollected created and stored", () => {
    assert.entityCount("BorrowCollected", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BorrowCollected",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "borrower",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BorrowCollected",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "BorrowCollected",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount0",
      "234"
    )
    assert.fieldEquals(
      "BorrowCollected",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount1",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
