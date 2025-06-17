export async function Signup (req, res) {
    const {emial,password,fullName} = req.body;
}

export async function Login (req, res) {
    res.send("Login Route");
}

export async function Logout (req, res) {
    res.send("Logout Route");
}