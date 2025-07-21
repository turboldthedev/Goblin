// lib/loadSecrets.ts
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

let cached: Record<string, string> | null = null;

export async function loadSecrets(): Promise<Record<string, string>> {
  if (cached) return cached;

  const client = new SecretsManagerClient({});
  const command = new GetSecretValueCommand({
    SecretId: "amplify/Goblin/main", // or whatever your Amplify App Secret ARN is
  });

  const { SecretString } = await client.send(command);
  if (!SecretString) {
    throw new Error("Empty secret from Secrets Manager");
  }

  const json = JSON.parse(SecretString) as Record<string, string>;
  // e.g. { NEXTAUTH_SECRET: "...", MONGODB_URI: "...", ... }
  cached = json;
  return json;
}
