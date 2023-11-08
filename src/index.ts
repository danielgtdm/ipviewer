#!/usr/bin/env node
import axios from "axios";
import { Iresponse } from "./response.interface";
import ora from "ora";
import yargs from "yargs";
import * as fs from "fs";

let TOKEN = "";
const jsonFilePath = "data.json";

const args: string[] = process.argv.slice(2);

async function ipviewer(ipAddress?: string): Promise<Iresponse | false> {
    if (ipAddress) return locateAddress(ipAddress);

    const spinner = ora("Getting data...");
    spinner.color = "yellow";

    const argv = await yargs(args)
        .option("l", {
            alias: "locate",
            describe: "Locate an IPv4 address",
            type: "string",
        })
        .option("t", {
            alias: "token",
            describe: "Set your IPinfo.io token",
            type: "string",
        })
        .option("v", {
            alias: "verbose",
            describe: "Get detailed output",
            type: "boolean",
        })
        .help()
        .alias("help", "h").argv;

    const token = argv.t;
    const ip = argv.l;
    const verbose = argv.v;

    if (token) {
        setToken(token);
    }

    if (ip) {
        spinner.start();
        TOKEN = getToken();
        const data = await locateAddress(ip);
        spinner.stop();

        data ? printConsole(data, verbose) : printIPError();

        return data;
    }

    return false;
}

async function locateAddress(ip: string): Promise<Iresponse | false> {
    if (isValidIPv4(ip)) {
        const url = `https://ipinfo.io/${ip}?token=${TOKEN}`;
        const res = axios.get<Iresponse>(url);
        return (await res).data;
    } else {
        return false;
    }
}

function printConsole(data: Iresponse, verbose?: boolean) {
    console.log(
        "\x1b[32m%s\x1b[0m",
        " --- the IP address has been located --- ",
    );

    console.log("\x1b[34m%s\x1b[0m", "IP: ", data.ip);
    console.log("\x1b[34m%s\x1b[0m", "City: ", data.city);
    console.log("\x1b[34m%s\x1b[0m", "Region: ", data.region);
    console.log("\x1b[34m%s\x1b[0m", "Country: ", data.country);

    if (verbose) {
        console.log("\x1b[34m%s\x1b[0m", "Postal Code: ", data.postal);
        console.log("\x1b[34m%s\x1b[0m", "Coordinates: ", data.loc);
        console.log("\x1b[34m%s\x1b[0m", "ISP: ", data.org);
        console.log("\x1b[34m%s\x1b[0m", "Time Zone: ", data.timezone);
    }

    console.log(
        "\x1b[35m%s\x1b[0m",
        " --- code by danielgtdm | data by ipinfo.io --- ",
    );
}

function printIPError() {
    console.log("\x1b[31m%s\x1b[0m", "No valid format for IP argument");
    console.log("Please use IPv4 syntax");
}

function isValidIPv4(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(ip);
}

function setToken(token: string) {
    const data = {
        token: token,
    };

    if (fs.existsSync(jsonFilePath)) {
        const existingData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

        existingData.token = token;

        fs.writeFileSync(
            jsonFilePath,
            JSON.stringify(existingData, null, 2),
            "utf-8",
        );
    } else {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf-8");
    }

    console.log("\x1b[32m%s\x1b[0m", "Your token was defined successfully");
}

function getToken(): string {
    if (fs.existsSync(jsonFilePath)) {
        const existingData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
        if (existingData.token) return existingData.token;
    }
    console.log("\x1b[31m%s\x1b[0m", "IPinfo.io token is not defined");
    console.log("to fix it execute: ipviewer -t yourIPinfotoken");
    process.exit(1);
}

ipviewer();

export default ipviewer;
