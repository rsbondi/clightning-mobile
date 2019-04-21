# Clightning Mobile Client

A mobile android app to control your clightning node.  This is not a mobile wallet, it is a remote client, 
all wallet functionality is in your node.

## Warning: this is in alpha

only use for testnet or with small amounts of funds, has some work to be done

## Requirements

a [clightning](https://github.com/ElementsProject/lightning) node with 
[remoteRPC](https://github.com/rsbondi/clightning-go-plugin/tree/master/remoteRPC)
plugin

## Usage

When app is launched for the first time, you will taken to the settings screen.
You will first need a registered domain name and a valid certificate from a recognized authority  ex. [letsencrypt](https://letsencrypt.org/).
Enter the requested informaition, `remoteUrl` to match your secured domain, including port, `remoteUser` and `remotePassword` to match those used for the `remoteRPC` plugin.
The `appPassword` is the local password to unlock the app.

Currently there is some basic payment, connection and invoice information.  Any connections must already be set from your node or from the app using the DEBUG tab which gives you full RPC access.

## To be implemented
* QR code scanner for payements, currently clipboard only
* Secure app settings
* Channel management
* Formatted detail pages
* Debug helpers