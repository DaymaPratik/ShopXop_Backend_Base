// import mongoose, { Db } from "mongoose";
// import { getMongoConnection } from "./data-source";

// class Database {
//   private static instance: Database;
//   private mongooseInstance: typeof mongoose | null = null;
//   private nativeDb: Db | null = null;

//   private constructor() {}

//   static getInstance(): Database {
//     if (!Database.instance) {
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }

//   /**
//    * Connect to MongoDB with pooling
//    */
//   async connectToDB(): Promise<void> {
//     if (!this.mongooseInstance) {
//       try {
//         this.mongooseInstance = await getMongoConnection();

//         const db = this.mongooseInstance.connection.db;
//         if (!db) {
//           throw new Error("Mongo native DB not initialized");
//         }

//         this.nativeDb = db;
//         console.log("Connected to MongoDB successfully");
//       } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         throw error;
//       }
//     }
//   }

//   /**
//    * Execute raw MongoDB command (PG entityManager.query equivalent)
//    */
//   async executeExternalQuery(command: any): Promise<any> {
//     if (!this.nativeDb) {
//       throw new Error("MongoDB connection not established!");
//     }

//     try {
//       return await this.nativeDb.command(command);
//     } catch (error) {
//       console.error("Error executing MongoDB command:", error);
//       throw error;
//     }
//   }
// }

// export default Database;
import { DataSource, MongoEntityManager } from "typeorm";
import { ShopXopDataSource } from "./data-source";

class Database {
  private static instance: Database;
  private dataSource: DataSource | null = null;
  private manager: MongoEntityManager | null = null;
// net start MongoDB :- To start the MongoDb Server run this command in the PowerShell Run AS Adminstrator
// & "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --replSet rs0 --dbpath "C:\data\db"
// mongosh
// rs.initiate()
// use shopxop
// db.init.insertOne({
//   name: "shopxop",
//   createdAt: new Date()
// })


  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }


  async connectToDB(): Promise<void> {
    if (!this.dataSource) {
      try {
        this.dataSource = ShopXopDataSource;

        if (!this.dataSource.isInitialized) {
          await this.dataSource.initialize();
        }

        this.manager = this.dataSource.mongoManager;
        console.log("✅ Connected to MongoDB via TypeORM");
      } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        throw error;
      }
    }
  }

  async executeExternalQuery(command: any): Promise<any> {
    if (!this.manager) {
      throw new Error("MongoDB connection not established!");
    }

    try {
      return await this.manager.command(command);
    } catch (error) {
      console.error("❌ Error executing MongoDB command:", error);
      throw error;
    }
  }

  /**
   * Get MongoEntityManager
   */
  getManager(): MongoEntityManager {
    if (!this.manager) {
      throw new Error("MongoDB manager not initialized");
    }
    return this.manager;
  }

  /**
   * Get DataSource
   */
  getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error("DataSource not initialized");
    }
    return this.dataSource;
  }
}

export default Database;
