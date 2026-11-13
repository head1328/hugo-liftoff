# Root redirects to the default language
GET {{BASE_URL}}/
HTTP 200
[Asserts]
xpath "string(//meta[@http-equiv='refresh']/@content)" contains "/en/"

# English homepage
GET {{BASE_URL}}/en/
HTTP 200
[Asserts]
header "Content-Type" contains "text/html"
header "Content-Security-Policy" exists
xpath "string(/html/@lang)" == "en"
xpath "string(//details[contains(@class,'lang-switcher')]/summary/span)" == "EN"
xpath "count(//link[@rel='alternate'][@hreflang='de'])" == 1
# The CSP has no 'unsafe-inline', browsers drop style attributes.
xpath "count(//*[@style])" == 0
[Captures]
css: xpath "string(//link[@rel='stylesheet'][contains(@href,'/css/main.')]/@href)"
js: xpath "string(//script[contains(@src,'/js/main.')]/@src)"

GET {{BASE_URL}}{{css}}
HTTP 200
[Asserts]
header "Content-Type" contains "text/css"

GET {{BASE_URL}}{{js}}
HTTP 200
[Asserts]
header "Content-Type" contains "javascript"

# German homepage
GET {{BASE_URL}}/de/
HTTP 200
[Asserts]
xpath "string(/html/@lang)" == "de"
xpath "string(//details[contains(@class,'lang-switcher')]/summary/span)" == "DE"
xpath "count(//*[@style])" == 0
# Internal links on German pages must keep the /de/ prefix.
xpath "count(//a[starts-with(@href,'/docs') or starts-with(@href,'/articles') or starts-with(@href,'/blueprints') or starts-with(@href,'/get-started')])" == 0

GET {{BASE_URL}}/de/docs/
HTTP 200
