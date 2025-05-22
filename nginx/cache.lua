local redis = require "resty.redis"
local red = redis:new()

red:set_timeout(1000) -- 1 sec

local ok, err = red:connect("redis", 6379)
if not ok then
    ngx.say("Failed to connect to Redis: ", err)
    return
end

local uri = ngx.var.uri
local cached, err = red:get(uri)

if cached == ngx.null then
    -- Cache miss: load file from /usr/local/openresty/nginx/html (your site files)
    local file = io.open("/usr/local/openresty/nginx/html" .. uri, "r")
    if not file then
        ngx.status = 404
        ngx.say("404 Not Found")
        return
    end
    local content = file:read("*a")
    file:close()

    red:set(uri, content)
    red:expire(uri, 60)

    ngx.say(content)
else
    -- Cache hit
    ngx.say(cached)
end
