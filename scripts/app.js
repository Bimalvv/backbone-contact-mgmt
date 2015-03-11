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
            /* To find the filter container and append 
               the <select> element to the page. */
            this.$el.find("#filter").append(this.createSelect());
            /* Bind 'filterByType()' method to the event */
            this.on("change:filterType", this.filterByType, this);
            /* Listening for the reset event and the function that 
               wish to invoke is the collection's render() method */
            this.collection.on("reset", this.render, this);
            this.render();
        },
        render: function () {
            /* Cleanup before adding items */
            this.$el.find("article").remove();

            var that = this;
            _.each(this.collection.models, function (item) {
                that.renderContact(item);
            }, this);
        },
        renderContact: function (item) {
            var contactView = new ContactView({
                model: item
            });
            this.$el.append(contactView.render().el);
        },
        events: {
            /* Hooking the change event that will be fired by the
               <select /> element within the '#filter' container. */
            "change #filter select": "setFilter"
        },
        getTypes: function () {
            /* Method to extract each unique contact 'type' and returns 
               an array created using Underscore's uniq() method.
               Backbone's pluck() method, will pull all values of a 
               single attribute out of a collection of models */
            return _.uniq(this.collection.pluck("type"), false, function (type) {
                return type.toLowerCase();
            });
        },
        createSelect: function () {
            /* Method to build the drop-down and return a new <select> element */
            var select = $("<select />", {
                html: "<option value='all'>All</option>"
            });
            _.each(this.getTypes(), function (item) {
                var option = $("<option />", {
                    value: item.toLowerCase(),
                    text: item.toLowerCase()
                }).appendTo(select);
            });
            return select;
        },
        /* Event handler for change event of dropdown */
        setFilter: function (e) {
            /* The value of the option that was selected will be available 
               in the currentTarget property of the event object that
               automatically passed to the handler. */
            this.filterType = e.currentTarget.value;
            /*  Trigger a custom change event for it using the property 
                name as a namespace which will perform actual filtering. */
            this.trigger("change:filterType");
        },
        filterByType: function () {
            if (this.filterType === "all") {
                /* Simply repopulate the collection with the complete set of
                   models if selected item is 'All'. Reset the collection in 
                   order to repopulate it with all of the models */
                this.collection.reset(contacts);
            } else {
                this.collection.reset(contacts, {
                    silent: true
                    /* To make sure that reset event is not fired. 
                       The view is not re-rendered unnecessarily when we reset the 
                       collection at the start of the second branch of the conditional. 
                       We need to do this so that we can filter by one type, and 
                       then filter by another type without losing any models. */
                });

                var filterType = this.filterType;
                var filtered = _.filter(this.collection.models, function (item) {
                    return item.get("type").toLowerCase() === filterType;
                });
                /* Reset the collection in order to 
                   repopulate it with the filtered models. */
                this.collection.reset(filtered);
            }
        }
    });

    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type": "urlFilter"
        },
        urlFilter: function(type) {
            directory.filterType = type;
            directory.trigger("change:filterType");
        }
    });
    
    // Initiate the View
    var directory = new DirectoryView();    
    // Initiate the router
    var contactsRouter = new ContactsRouter();
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

}(jQuery));