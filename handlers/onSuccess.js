const corsHeaders = require("../corsHeaders");

function onSuccess(res, data) {
    res.writeHead(200, corsHeaders);
    if (data !== undefined) {
        res.write(
            JSON.stringify({
                status: "success",
                data: data,
            })
        );
    }
    res.end();
}

module.exports = onSuccess;
