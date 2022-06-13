import Db from "../../database";

/// TYPES ///

type TUser = {
  first_name: string;
  last_name: string;
  email: string;
};

export type TUserRecord = TUser & {
  id: number;
  balance: number;
};

type TGetUserOptions = {
  id?: number;
  email?: string;
};

/// LOGIC ///

async function createUser(account: TUser): Promise<void | Error> {
  const maybeError = await Db.run(
    `INSERT INTO User (first_name, last_name, email)
     VALUES ($first_name, $last_name, $email)`,
    {
      $first_name: account.first_name,
      $last_name: account.last_name,
      $email: account.email,
    }
  );

  if (maybeError instanceof Error) return new Error("Could not create user");
}

async function getUser(options: TGetUserOptions): Promise<TUserRecord | Error> {
  let maybeResult;

  if (options.hasOwnProperty("id")) {
    maybeResult = await Db.retrieve<TUserRecord>("SELECT * FROM User WHERE id=?", options.id);
  } else if (options.hasOwnProperty("email")) {
    maybeResult = await Db.retrieve<TUserRecord>("SELECT * FROM User WHERE email=?", options.email);
  }

  if (maybeResult instanceof Error || maybeResult === undefined || maybeResult.length < 1) {
    return new Error("Could not retrieve user");
  }

  return maybeResult[0];
}

async function updateBalance(userId: number, balance: number): Promise<void | Error> {
  const maybeError = await Db.run("UPDATE User SET balance=? WHERE id=?", balance, userId);
  if (maybeError instanceof Error) return new Error("Could not update balance");
}

export default { createUser, getUser, updateBalance };
