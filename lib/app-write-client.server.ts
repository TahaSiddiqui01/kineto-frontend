import { Client } from "appwrite";

export const appWriteClient = new Client()
    .setEndpoint("https://sfo.cloud.appwrite.io/v1") // Your API Endpoint
    .setProject("69c2f5830000bcaabfe7");                 // Your project ID
    // .setEndpoint(process.env.ENDPOINT_ID || "") // Your API Endpoint
    // .setProject(process.env.PROJECT_ID || "");                 // Your project ID
