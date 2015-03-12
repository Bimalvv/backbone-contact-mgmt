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
            address: "3333, a street, a town, a city, AB12 3CD",
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
            name: "",
            address: "",
            phone: "",
            email: "",
            type: "",
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
        events: {
            "click button.delete": "deleteContact"
        },
        deleteContact: function () {
            /* First store the type of the contact that we just deleted. */
            var removedType = this.model.get("type").toLowerCase();
            this.model.destroy();
            /* remove the HTML representation of the view from the page. */
            this.remove();

            /* Get all of the types of the models in the directory collection and 
               check to see if the type of the contact that was just removed is 
               still contained within the resulting array. */
            if (_.indexOf(directory.getTypes(), removedType) === -1) {
                directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
            }
        },
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

            this.collection.on("add", this.renderContact, this);
            this.collection.on("remove", this.removeContact, this);

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
        removeContact: function (removedModel) {
            var removed = removedModel.attributes;

            /* The original items in the contacts array didn't have the photo property
               defined, but as this is specified as a default property, all of our models 
               will inherit the property and will therefore fail any comparison with 
               the objects in the contacts array. So check the photo property of the 
               model is the same as the default value and if it is remove it. */
            if (removed.photo === "/imgs/placeholder.png") {
                delete removed.photo;
            }

            _.each(contacts, function (contact) {
                if (_.isEqual(contact, removed)) {
                    contacts.splice(_.indexOf(contacts, contact), 1);
                }
            });
        },
        events: {
            /* Hooking the change event that will be fired by the
               <select /> element within the '#filter' container. */
            "change #filter select": "setFilter",
            /* Hooking the click event triggered by the element 
               with an id of add*/
            "click #add": "addContact",
            /* Hide the addContact first and show when clicked */
            "click #showForm": "showForm"
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
                /* Update the url with the selected type - 'all'. */
                contactsRouter.navigate("filter/all");
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
                /* filter down the collection to only those models containing a specific type */
                var filtered = _.filter(this.collection.models, function (item) {
                    return item.get("type").toLowerCase() === filterType;
                });
                /* Reset the collection in order to 
                   repopulate it with the filtered models. */
                this.collection.reset(filtered);
                /* Update the url with the selected type. */
                contactsRouter.navigate("filter/" + filterType);
            }
        },
        addContact: function (e) {
            e.preventDefault();

            var newModel = {};
            $("#addContact").children("input").each(function (i, el) {
                /* Check that the field has had text entered into it */
                if ($(el).val() !== "") {
                    /* add a new property to the object with a 
                            key equal to the id of the current element, and a 
                            value equal to its current value. */
                    newModel[el.id] = $(el).val();
                }
            });

            contacts.push(newModel);

            if (_.indexOf(this.getTypes(), newModel.type) === -1) {
                this.collection.add(new Contact(newModel));
                this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
            } else {
                this.collection.add(new Contact(newModel));
            }
        },
        showForm: function(){
            this.$el.find("#addContact").slideToggle();
        }
    });

    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type": "urlFilter"
        },
        urlFilter: function (type) {
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