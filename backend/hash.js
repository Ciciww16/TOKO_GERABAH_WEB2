import bcrypt from "bcrypt";

const users = [
    { name: "Rizky", password: "passRizky" },
    { name: "Nadia", password: "passNadia" },
    { name: "Fahri", password: "passFahri" },
    { name: "Laila", password: "passLaila" },
    { name: "Rangga", password: "passRangga" },
    { name: "Maya", password: "passMaya" },
    { name: "Aditya", password: "passAditya" },
    { name: "Sabrina", password: "passSabrina" },
    { name: "Bayu", password: "passBayu" },
    { name: "Diana", password: "passDiana" }
];

const saltRounds = 10;

async function hashAll() {
    console.log("=== HASIL HASH PASSWORD ===\n");

    for (const user of users) {
        const hashed = await bcrypt.hash(user.password, saltRounds);

        console.log(`Nama     : ${user.name}`);
        console.log(`Password : ${user.password}`);
        console.log(`Hash     : ${hashed}`);
        console.log("----------------------------------");
    }
}

hashAll();