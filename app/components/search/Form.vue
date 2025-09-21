<template>
  <div class="search">
    <h1>Find Tubes</h1>
    <form class="search--form">
      <div
        class="search--form--field-container"
        :class="{ invalid: formErrors?.searchQuery === false }"
      >
        <label for="searchQuery" hidden>Search</label>
        <input 
          v-model="searchQuery"
          id="searchQuery"
          type="search"
          placeholder="I'm in the mood for..."
          @blur="validate"
        >
        
        <!-- $refs.searchQuery.focus() -->
        <div class="clear" @click="searchQuery = null; ">
          <ClientOnly>
            <Icon name="material-symbols:cancel-rounded" />
          </ClientOnly>
        </div>
        
        <div class="search--form--error">Please enter a search term.</div>
      </div>
      <div class="search--form--field-container">
        <div class="submit--container">
          <div class="styled-wrapper">
            <button class="button" @click.prevent="handleSearch">
              <div class="button-box">
                <span class="button-elem">
                  <ClientOnly>
                    <Icon name="material-symbols:arrow-forward-rounded" />
                  </ClientOnly>
                </span>
                <span class="button-elem">
                  <ClientOnly>
                    <Icon name="material-symbols:arrow-forward-rounded" />
                  </ClientOnly>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
const searchQuery = ref(null);
const isError = ref(false);
const formErrors = ref(null);

const validate = () => {
  // Setup for larger form schema
  const fields = {
    searchQuery: searchQuery.value ? true : false,
  }
  // Valid is true if all fields
  const valid = Object.values(fields).every(value => value === true);
  // Set error state based on valid status
  isError.value = !valid;
  // Return null or schema object for error message reveals
  formErrors.value = valid ? null : fields;
}

const handleSearch = async() => {
  validate();
  if(isError.value) return;
  
  await navigateTo({
    path: '/feed',
    query: {
      q: searchQuery.value
    }
  });
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 4rem 10%;
  box-sizing: border-box;
  align-items: center;

  h1 {
    font-size: 2rem;
    color: var(--c-white);
    font-weight: 500;
    line-height: 1;
    margin: 0;
    margin-bottom: 1em;
  }

  &--form {
    width: 100%;

    &--field-container {
      display: grid;
      grid-template-columns: auto 3rem;
      grid-template-rows: 1;

      * {
        grid-row: 1;
      }

      input {
        grid-column: 1 / span 2;

        &[type="search"] {
          padding: 1rem 2.4rem 1rem 1.4rem;

          &:focus+.clear {
            opacity: 1;
            user-select: auto;
            cursor: pointer;
          }
        }
      }

      .clear {
        grid-column: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        user-select: none;
        transition: opacity 0.3s ease;
        .iconify {
          display: block;
          width: 1.4rem;
          height: 1.4rem;
          color: var(--c-black);
        }
      }

      &.invalid {
        input {
          outline-color: var(--c-error);
        }
        .search--form--error {
          display: block;
        }
      }
    }
    &--error {
      display: none;
      padding: .8rem 1.4rem;
      font-size: .8rem;
      color: var(--c-error);
      letter-spacing: 0.05rem;
      grid-row: 2;
    }
  }

  input {
    width: 100%;
    border-radius: 10px;
    outline: 2px solid var(--c-white-20);
    border: 0;
    font-size: 1rem;
    font-family: "DM Sans", sans-serif;
    background-color: var(--c-white-50);
    outline-offset: 3px;
    padding: 1rem 1.4rem;
    transition: 0.15s ease;
    
    &:focus {
      outline: 2px solid var(--c-action-dislike);
      outline-offset: 5px;
      background-color: var(--c-white);
    }

    &::placeholder {
      color: var(--c-black);
    }

    &::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
    }

    &.invalid {
      outline-color: var(--c-error);
    }
  }
}

// Adapted from https://uiverse.io/karthik092726122003/clever-crab-26

.submit--container {
  grid-column: 1 / span 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-block: 3rem;
}

.styled-wrapper {
  .button {
    display: block;
    position: relative;
    width: 76px;
    height: 76px;
    margin: 0;
    overflow: hidden;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    border: 0;
    
    &:before {
      content: "";
      position: absolute;
      border-radius: 50%;
      inset: 7px;
      border: 3px solid var(--c-white-20);
      transition:
        opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
        transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
    }
    
    &:after {
      content: "";
      position: absolute;
      border-radius: 50%;
      inset: 7px;
      border: 4px solid var(--c-action-dislike);
      transform: scale(1.3);
      transition:
        opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
        transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 0;
    }
    
    &:hover:before,
    &:focus:before {
      opacity: 0;
      transform: scale(0.7);
      transition:
        opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
        transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    &:hover:after,
    &:focus:after {
      opacity: 1;
      transform: scale(1);
      transition:
        opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
        transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
    }
    
    &-box {
      display: flex;
      position: absolute;
      top: 0;
      left: -69px;
    }
    
    &-elem {
      display: block;
      width: 30px;
      height: 30px;
      margin: 24px 18px 0 22px;

      .iconify {
        width: 100%;
        height: 100%;
        color: var(--c-white-20);
      }
    }
    
    &:hover .button-box,
    &:focus .button-box {
      transition: 0.4s;
      transform: translateX(69px);
    }
  }
}
</style>