import { createClient, RedisClientType } from "redis";

export const getRedisClient = async () => {
  let client = null;

  if (!client) {
    client = createClient();
    client.on("error", (error) => console.log("Redis Error Occured", error));
    try {
      await client.connect();
      console.log("Connected to Redis!");
    } catch (error) {
      console.log("Connection Error", error);
      throw error;
    }
  }
  return client;
};

export default getRedisClient;
