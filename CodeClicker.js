/*-------------------------------Client-Code-------------------------------------*/
if (Meteor.isClient) {
  Accounts.ui.config
  ({
	passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.hello.greeting = function () 
  {
    return "Welcome to CodeClicker.";
  };

  Template.hello.events({
    'click input.code': function () 
    {
        Meteor.call('click');
    },

    'click input.buy': function (event)
    {
	Meteor.call('buy', event.target.id);
    },

    'click input.reset': function()
    {
	Meteor.call('reset');
    }
  });

  Meteor.subscribe('userData');

  Template.hello.user = function ()
  {
	return Meteor.user();
  }

  Template.hello.items = function ()
  {
	var itemList = [
		{name: "Monkey",             	cost: 500},
		{name: "Toddler", 		cost: 1500},
		{name: "Average 12 yr old", 	cost: 2500},
		{name: "Truex",	     		cost: 10000}

	];

	return itemList;
  }
}
/*-------------------------------Server-Code-------------------------------------*/
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
   Accounts.onCreateUser(function(options, user)
   {
	user.money = 0;
	user.rate = 0;
	return user;
   });

   Meteor.publish("userData", function ()
   {
	return Meteor.users.find({}, {sort: {'money': -1}});
   });

   Meteor.setInterval(function()
   {
	Meteor.users.find({}).map(function(user)
	{
		Meteor.users.update({_id: user._id}, {$inc: {'money': user.rate}})
	});
   }, 1000)

  });
}
/*-------------------------------------------------------------------------------*/
Meteor.methods
({
  click: function ()
  {
	Meteor.users.update({_id: this.userId}, {$inc: {'money': 25}});
  },

  buy: function (amount)
  {
	if(Meteor.user().money >= amount && amount > 0)
	  Meteor.users.update({_id: this.userId}, {$inc: {'rate': (Math.floor(amount/500)), 'money': 		    (0-amount)}});
  },

  reset: function ()
  {
	Meteor.users.update({_id: this.userId}, {$set: {'money': 0, 'rate': 0}});
  }
});
