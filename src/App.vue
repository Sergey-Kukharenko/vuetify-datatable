<template>
  <v-app>
    <v-main>
      <v-container class="container-flex">
        <div v-if="loading" class="spinner-container">
          <div class="spinner-overlay"></div>
          <rotate-square2></rotate-square2>
        </div>
        <template v-else>
          <v-data-table
              :headers="headers"
              :items="products"
              :items-per-page="10"
              :page="page"
              :search="search"
              :custom-filter="filter"
              sort-by="calories"
              class="elevation-1"
              @update:page="pagination"
          >
            <template v-slot:top>
              <v-text-field
                  v-model="search"
                  label="Search ..."
                  class="mx-4"
                  color="gray"
              ></v-text-field>

              <v-dialog
                  v-model="dialog"
                  max-width="500px"
              >
                <v-card>
                  <v-container>
                    <h1 class="title">{{ item.name }}</h1>
                    <div class="section" v-for="(value, key) in item.detail" :key="key">
                      <div class="section__title">{{ key }} :</div>
                      <div class="section__text">
                        <span class="section__detail" v-for="(v, idx) in value" :key="idx">{{ v }}</span>
                      </div>
                    </div>
                  </v-container>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item="{ item }">
              <tr @click="open(item)">
                <td v-for="text in item" :key="text">{{ text }}</td>
              </tr>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </v-data-table>
          <v-footer
              dark
              padless
          >
            <v-card
                class="flex"
                flat
            >
              <v-card-title>
                <strong class="subheading">Sergey Kukharenko</strong>

                <v-spacer></v-spacer>

                <v-btn
                    class="mx-4"
                    dark
                    icon
                    href="https://github.com/Sergey-Kukharenko/vuetify-datatable.git"
                    target="_blank"
                >
                  <v-icon size="24px">
                    {{ 'mdi-github' }}
                  </v-icon>
                </v-btn>
              </v-card-title>
            </v-card>
          </v-footer>
        </template>
        <v-snackbar
            v-if="error"
            :timeout="2000"
            :multi-line="true"
            @input="closeError"
            :value="true"
            centered
        >
          {{ error }}
          <v-btn
              color="red"
              text
              @click="closeError"
              class="ml-auto"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {RotateSquare2} from 'vue-loading-spinner'

export default {
  data: () => ({
    search: '',
    page: null,
    dialog: false,
    item: {},
    headers: [],
  }),

  components: {
    RotateSquare2
  },

  computed: {
    products() {
      return this.$store.getters.products
    },
    product() {
      return this.$store.getters.product
    },
    loading() {
      return this.$store.getters.loading
    },
    error() {
      return this.$store.getters.error
    },
  },

  methods: {
    filter(value, search) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search.toString().toLocaleUpperCase()) !== -1
    },
    pagination(page) {
      this.$router.push(`${this.$route.path}?page=${page}`).catch(() => {
      })
    },
    closeError() {
      this.$store.commit('clearError');
    },
    async open(item) {
      if (this.product.name !== item.name) {
        await this.$store.dispatch('fetchProduct', item.name)
      }

      this.item = Object.assign({}, this.product)
      this.dialog = true
    },
    close() {
      this.dialog = false
    },
    createHeaders(obj) {
      const arr = []
      Object.keys(obj).map(i => {
        return arr.push({text: i, value: i})
      })
      this.headers = arr
    }
  },

  async mounted() {
    await this.$store.dispatch('fetchProducts')
    this.page = +this.$route.query.page || 1
    this.createHeaders(this.products[0])
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  }
}
</script>

<style lang="scss">

tbody > tr {
  cursor: pointer;
}

.container-flex {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.v-sheet.v-footer {
  border-radius: 4px;

  @media (max-width: 767px) {
    margin-top: 16px;
  }
}

.v-data-footer {
  @media (max-width: 767px) {
    padding: 0 8px 8px 8px;
  }
}

.v-snack__content {
  display: flex;
  align-items: center;
}

.spinner-container, .spinner-overlay, .spinner {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.spinner-overlay {
  background: #ffffffb0;
  z-index: 1;
  -webkit-backdrop-filter: saturate(180%) blur(4px);
  backdrop-filter: saturate(180%) blur(3px);
}

.spinner-container, .spinner {
  z-index: 2;
}

.spinner:after {
  background: #2e2e2e !important;
}

.v-application .title {
  font-size: 1em !important;
}

.v-data-table--mobile > .v-data-table__wrapper tbody {
  @media (max-width: 767px) {
    display: block;
  }
}

.v-data-footer__select {
  @media (max-width: 767px) {
    width: 100%;
    margin: 0 auto !important;
  }
}

.v-data-footer__pagination {
  @media (max-width: 767px) {
    width: 50%;
  }
}

.section {
  margin: 8px 0;

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 767px) {
    display: flex;
  }

  &__title {
    flex: 0 0 54px;
    font-weight: 500;
    font-size: 12px;
    padding: 3px 0;
  }

  &__text {
    flex: 1;
    display: inline-flex;
    flex-wrap: wrap;
    font-weight: 400;
    font-size: 12px;
    color: #747474;
    padding: 2px;
    margin-left: -2px;
    border-radius: 4px;
  }

  &__detail {
    background: #ffffff;
    color: #6a6a6a;
    padding: 1px 4px;
    margin: 2px;
    border: 1px solid #ebebeb;
  }
}

</style>

