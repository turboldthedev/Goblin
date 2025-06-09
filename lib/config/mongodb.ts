// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Type-augment Node’s global so TS knows about our cache
declare global {
  // eslint-disable-next-line no-var
  var _mongo: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global._mongo;
if (!cached) {
  cached = global._mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // kick off the connection once
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        dbName: "goblin",
        bufferCommands: false, // requires us to await before running queries
      })
      .then((m) => {
        return m;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
