<script>
    // Этот код не менять------------------------------------------------
    $(document).ready(function () {
        let url = new URL(window.location.href);
        let params = new URLSearchParams(url.search.slice(1));
        let source = params.get('utm_source'),
            medium = params.get('utm_medium'),
            campaign = params.get('utm_campaign'),
            content = params.get('utm_content'),
            term = params.get('utm_term'),
            tagParams = params.get('tag');

        let startContent = params.get("start");

        let tags = [];
        if (tagParams) {
            tagParams = tagParams.split(';')
            for (let i = 0; i < tagParams.length; i++) {
                if (tagParams[i] == '') {
                    continue;
                }
                tags.push(tagParams[i])
            }
        }

        let whatsappButtonUrl = 'https://easy-mo.ru/c/whatsapp/';

        let utms = '?';
        if (source) utms += 'utm_source=' + source + '&';
        if (medium) utms += 'utm_medium=' + medium + '&';
        if (campaign) utms += 'utm_campaign=' + campaign + '&';
        if (content) utms += 'utm_content=' + content + '&';
        if (term) utms += 'utm_term=' + term + '&';
        // ----------------------------------------------------------------


        $('#rec607563243 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
        
        $('#rec607596095 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
        
        $('#rec615069123 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
                
        $('#rec607275408 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
        
        $('#rec607607628 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);

        EclkEvents.on('event', function (params) {
            // utms += 'tracker[Easyclk][click_id]=' + params.click_id + '&';

            // $('#rec607563243 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
            
            // $('#rec607596095 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);

            // $('#rec615069123 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
            
            // $('#rec607275408 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
            
            // $('#rec607607628 a').first().attr("href", whatsappButtonUrl + 'rs_test_1' + utms);
            
            console.log(`Кнопка нажата`)

        });
        
        
        
        let btns = [
            '#rec490159915 a',
            '#rec490159967 a',
            '#rec490159967 a',
        ];
       for (let i = 0; i < btns.length; i++) {
                if (i >= 0) {
                    if (i >= 0 && i < 115) {
                        $(btns[i]).first().attr("href", whatsappButtonUrl + 'school_3' + utms + 'tag=' + tagMarch + '&');
                        
                    }
                }

            }
        
        
    });
console.log(`Кнопка ${param.click_id} нажата`)
</script>