import mongoose from "mongoose";

const dbConnection = () => {
    mongoose
        .connect(process.env.MONGO_URL,{
            dbName:"PORTFOLIO",
        })
        .then(() => {
            console.log("Connected to the DataBase");
        })
        .catch((error) => {
            console.log(`some error ${error}`);
        })
}

export default dbConnection;