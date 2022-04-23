const is_test = true;
module.exports={
    SERVER_URL: (is_test ? "http://localhost:8080" : "http://142.91.3.143:8080"),
    LOCAL_URL: (is_test ? "http://localhost:3000" : "http://142.91.3.143:3000"),
}