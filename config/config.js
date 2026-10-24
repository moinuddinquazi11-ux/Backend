import dotenv from "dotenv"

dotenv.config()

export const config = {
    port: process.env.PORT || 8000,
    mongoUrl: process.env.MONGO_URI || "mongodb+srv://moinuddinquazi11_db_user:36N6xOwS8VvFhZ3g@dbcluster.lt8gbj1.mongodb.net/DBCluster"
}
