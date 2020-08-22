import '@styles/modal_window';
import * as $ from "jquery";

interface ModalSettings {
    content: JQuery
    width: number
    height: number
}

export default class ModalWindowComponent {
    private readonly $closeButton;
    private readonly $content;
    private $modal;
    private $window;

    private content;

    constructor() {
        this.$closeButton = $('<button role="button" class="modal_close" title="Close"><span></span></button>');
        this.$content = $('<div class="modal_content"/>');
        this.$modal = $('<div class="modal"/>');
        this.$window = $(window);

        this.content = $('.modal_info').detach();

        this.$modal.append(this.$content, this.$closeButton);

        this.$closeButton.on('click', ( event ) => {
            event.preventDefault();

            $('.modal')
                .addClass('conceal')
                .removeClass('display')
            $('.open_button').removeClass('load')

            this.close();
        })
    }

    show( h1Content: string, pContent: string ) {
        this.open({
            content: this.content,
            width: 540,
            height: 270
        })

        this.content.addClass('modal_content');
        $('.modal').addClass('display');
        $('.open_button').addClass('load');

        const $modalInfo = $('.modal_info');
        $modalInfo.find("h1").html(h1Content);
        $modalInfo.find("p").html(pContent);
    }

    private center() {
        const top = Math.max(this.$window.height() - this.$modal.outerHeight(), 0) / 2;
        const left = Math.max(this.$window.width() - this.$modal.outerWidth(), 0) / 2;
        this.$modal.css({
            top: top + this.$window.scrollTop(),
            left: left + this.$window.scrollLeft()
        })
    }

    private open( settings: ModalSettings ) {
        this.$content.empty().append(settings.content);

        this.$modal.css({
            width: settings.width || 'auto',
            height: settings.height || 'auto'
        }).appendTo('body');

        this.center();
        this.$window.on('resize', this.$modal.center);
    }

    private close() {
        this.$content.empty();
        this.$modal.detach();
        this.$window.off('resize', this.$modal.center)
    }
}
