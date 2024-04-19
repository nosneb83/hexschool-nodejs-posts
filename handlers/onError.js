const corsHeaders = require("../corsHeaders");

function onError(res, err) {
    let message = "";
    if (err) {
        message = err.message;
    } else {
        message = "欄位未填寫正確, 或無此ID";
    }

    res.writeHead(400, corsHeaders);
    res.write(
        JSON.stringify({
            status: "failed",
            message,
        })
    );
    res.end();
}

module.exports = onError;
