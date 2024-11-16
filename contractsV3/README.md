# Unilend

Borrow and Lending protocol for UniswapV3 LP positions on Unichain. Cash upfront for the lender and gambling for the borrower.

[Contract on Blockscout](https://unichain-sepolia.blockscout.com/address/0x72be0bADDD3B90F3202021919C7755A1e86386ae?tab=contract)

## Getting Started

Start by getting `foundryup` latest version and installing the dependencies.

```sh
$ curl -L https://foundry.paradigm.xyz | bash
$ foundryup
$ yarn
```

If this is your first time with Foundry, check out the
[installation](https://github.com/foundry-rs/foundry#installation) instructions.

### Clean

Delete the build artifacts and cache directories:

```sh
$ yarn clean
```

### Compile

Compile the contracts:

```sh
$ yarn build
```

### Test

Run the tests:

```sh
$ yarn test
```

## License

This project is licensed under MIT.
