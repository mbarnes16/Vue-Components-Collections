const Library = Vue.component('Library', {
    // this function is run AFTER the props have been passed in
    data() {
        // without chaining
        // let libraryCollection = new LibraryCollection();
        // libraryCollection.addItem(new Book('Interaction Design', 200));
        // libraryCollection.addItem(new Movie('Paw Patrol!', 78));
        // libraryCollection.addItem(new Movie('Harriet', 122));
        // libraryCollection.addItem(new Book('Brown Bear, Brown Bear', 0));

        return {
            //library: libraryCollection
            library: new LibraryCollection()
                .addItem(new Book('Interaction Design', 200))
                .addItem(new Movie('Paw Patrol!', 78))
                .addItem(new Movie('Harriet', 122))
                .addItem(new Book('Brown Bear, Brown Bear', 0))
        }
    },

    template: `
    <div class="card-columns">
      <library-item v-for="item in library" :item="item"></library-item>
      <div class="card">
        <p>Checked out: {{ library.checkedOutItems().length }}</p>
      </div>
      
    </div>
  `
})

const LibraryItemComponent = Vue.component('LibraryItem', {
    // values/bindings passed to this component
    props: {
        item: Object
    },

    computed: {
        typeOfItem(){
            return this.item.constructor.name;
        }
    },

    // the view
    template: `
          <div class="card" :class="item.isAvailable() ? 'border-success' : 'border-warning'" style="border-width: 3px;">
<!--                <h3 class="card-title">{{item.title}}</h3>-->
<!--                <p class="card-text" v-if="item.constructor.name == 'Book'">Pages: {{item.pages}}</p>-->
<!--                <p class="card-text" v-if="item.runningTime">Running Time: {{item.runningTime}}</p>-->
          <div class="card-body">
            <component :is="typeOfItem" :item="item"></component>
          </div>
          <div class="card-footer">
            <button @click="item.checkOut()" class="btn btn-secondary">Check Out</button>
            <button @click="item.checkIn()" class="btn btn-secondary">Check In</button>
            <button @click="$eventBus.$emit('addItem', item)" class="btn btn-secondary">Add to Cart</button>
            <button @click="$eventBus.$emit('removeItem', item)" class="btn btn-secondary">Remove from Cart</button>
            <button @click="item.favorite()" class="btn btn-secondary">{{item.isFavorite ? 'Unfavorite' : 'Favorite'}}</button>
          </div>
          </div>
      `,
});

const BookComponent = Vue.component('Book', {
    props: {
        item: Book
    },

    template: `
      <div class="book">
          <h3 class="card-title">{{item.title}}</h3>
          <p class="card-text">Pages: {{item.pages}}</p>
      </div>
    `,
});

const MovieComponent = Vue.component('Movie', {
    props: {
        item: Movie
    },

    template: `
          <div class="movie">
              <h3 class="card-title">{{item.title}}</h3>
              <p class="card-text">Running Time: {{item.runningTime}}</p>
          </div>
      `,
});

const Cart = Vue.component('Cart', {
    created() {
        this.$eventBus.$on('addItem', (item) => {
            this.cart.addItem(item)
            // console.log(this.cart.length, this.cart, this);
            this.$forceUpdate();
        });
        this.$eventBus.$on('removeItem', (item) => {
            this.cart.removeItem(item)
            // console.log(this.cart.length, this.cart, this);
            this.$forceUpdate();
        });

    },

    data() {
        return {
            cart: new CartCollection()
        }
    },

    template: `
    <div class="card-columns">
      <div class="card">
        <p>Items in cart: {{cart.length}}</p>
      </div>
      <cart-item v-for="item in cart" :item="item"></cart-item>
    </div>
  `
})