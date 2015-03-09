(function ($) {
    var contacts = [
        {
            name: "Contact 1",
            address: "1040, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "family"
        },
        {
            name: "Contact 2",
            address: "1, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "family"
        },
        {
            name: "Contact 3",
            address: "3900, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "friend"
        },
        {
            name: "Contact 4",
            address: "4700, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "colleague"
        },
        {
            name: "Contact 5",
            address: "5500, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "family"
        },
        {
            name: "Contact 6",
            address: "6300, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "colleague"
        },
        {
            name: "Contact 7",
            address: "7200, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "friend"
        },
        {
            name: "Contact 8",
            address: "8100, a street, a town, a city, AB12 3CD",
            phone: "0123456789",
            email: "anemail@me.com",
            type: "family"
        }
    ];

    var Contact = Backbone.Model.extend({
        defaults: {
            photo: '/imgs/placeholder.png'
        }
    });

    var Directory = Backbone.Collection.extend({
        model: Contact
    });

    var ContactView = Backbone.View.extend({
        tagName: "article",
        className: "contact-container",
        template: $("#contactTemplate").html(),

        render: function () {
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        }
    });

    var DirectoryView = Backbone.View.extend({
        el: $("#main"),
        initialize: function () {
            this.collection = new Directory(contacts);
            this.render();
        },
        render: function () {
            var that = this;
            _.each(that.collection.models, function (item) {
                that.renderContact(item);
            }, that);
        },
        renderContact: function (item) {
            var contactView = new ContactView({
                model: item
            });
            this.$el.append(contactView.render().el);
        }
    });

    var directory = new DirectoryView();
    
}(jQuery));