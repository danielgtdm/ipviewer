# ipviewer

This is a library for locate IPv4 addresses, using as data source the [IPinfo.io](https://ipinfo.io/) free service.

You will need to create an account in [IPinfo.io](https://ipinfo.io/) and get your own token (very easy) that look like `8e1441b9******`.

At the moment, free plan service allow 50k lookups per month, perfect for little projects.

# Installation

## Use in terminal

For use in terminal, install globally using npm:

```sh
$ npm install ipviewer -g
```

If you need permissions for global installation:

```sh
$ sudo npm install ipviewer -g
```

Then execute:

```sh
$ ipviewer --version
```

If the installation was successful, this should print the latest version of ipviewer.

### Set token

Put your token in ipviewer for start using:

```sh
$ ipviewer -t 8e1441b9******
```

### Use

Locate an IP using ipviewer with the `-l` flag, for example:

```sh
# input
$ ipviewer -l 8.8.4.4

# output
IP:  8.8.4.4
City:  Mountain View
Region:  California
Country:  US
```

For detailed output, use the `-v` flag:

```sh
# input
$ ipviewer -l 8.8.4.4 -v

# output
IP:  8.8.4.4
City:  Mountain View
Region:  California
Country:  US
Postal Code:  94043
Coordinates:  37.4056,-122.0775
ISP:  AS15169 Google LLC
Time Zone:  America/Los_Angeles
```

## Use in Nodejs projects

Soon...
