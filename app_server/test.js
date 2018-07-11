const xml2js = require("xml2js");

function test() {
    var testStr = `<xml><appid><![CDATA[wxe6c6ab2ef372xxxx]]></appid>
    <attach><![CDATA[2&85&139&0]]></attach>
    <bank_type><![CDATA[CFT]]></bank_type>
    <cash_fee><![CDATA[1]]></cash_fee>
    <fee_type><![CDATA[CNY]]></fee_type>
    <is_subscribe><![CDATA[Y]]></is_subscribe>
    <mch_id><![CDATA[129933xxxx]]></mch_id>
    <nonce_str><![CDATA[6xj94ajjika3io01f50z2cf9658fhhtj]]></nonce_str>
    <openid><![CDATA[ojN41uHLEXYuHkrJg2_PaDvxxxxx]]></openid>
    <out_trade_no><![CDATA[129933950120170618102333]]></out_trade_no>
    <result_code><![CDATA[SUCCESS]]></result_code>
    <return_code><![CDATA[SUCCESS]]></return_code>
    <sign><![CDATA[5060B8EE326BD346B7808D9996594A79]]></sign>
    <time_end><![CDATA[20170618102338]]></time_end>
    <total_fee>1</total_fee>
    <trade_type><![CDATA[JSAPI]]></trade_type>
    <transaction_id><![CDATA[4001862001201706186249259476]]></transaction_id>
    </xml>`;
    return xml2js.parseString(testStr, (err, data) => {
        console.log(data);
    });
}

console.log(test());