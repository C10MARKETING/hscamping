<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
body {
  font-size: 14px;
  color: #556b79;
  font-family: Arial, sans-serif;
}
#app {
  padding: 0;
  margin: 20px;
}
[v-cloak] {
  display: none;
}
input, select, button {
  font-size: inherit;
  font-family: inherit;
}
input[type="text"],input[type="number"], select, textarea {
  border: 1px solid #d2d2d2;
}
button {
  padding: 3px;
}
select {
  padding: 4px;
}
.search input, .flatpickr-input {
  padding: 6px;
  max-width: 40%;
}
.flatpickr-input {
  margin-left: -100px;
}
label {
  cursor:pointer;
}
.activity.past {
  opacity: 0.6;
}
.activity {
  position: relative;
  max-width: 100%;
  height: 100px;
  background-color: #ACC6C7;
  display: flex;
  margin: 10px 10px 0 0;
  cursor: pointer;
  overflow: hidden;

  img:first-child {
    height: 100px;
    min-width: 100px;
    max-width: 100px;
  }

  .content {
    position: relative;
    flex-grow: 1;
  }

  .title {
    font-weight: bold;
    text-transform: uppercase;
  }

  .heading {
    font-weight: bold;
    width: 120px;
    min-width: 120px;
    margin-right: 10px;
    display: inline-block;
  }

  .text {
    display: inline-block;
    width: calc(100%-130px);
  }

  .info {
    display: flex;
    margin-top: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
.content {
  padding: 10px;

  div {
    margin-bottom: 5px;
  }
}
.search, .date-picker {
  display: flex;
  margin-bottom: 15px;
  input {
    border: 1px solid #556b79;
    padding: 8px;
    font-size: 1.2em;
    display:block;
    margin-right: 10px;
  }
  img {
    cursor: pointer;
  }
}
button{
  color: #556b79;
  background-color: #ACC6C7;
  border: 0;
  padding: 10px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    color: #ACC6C7;
    background-color: #556b79;
  }
}
.date {
  margin-bottom: 10px;
}
.spinner {
    border: 3px solid #ACC6C7;
    border-top: 3px solid #556b79;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    animation: spin 2s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.flatpickr-days {
  background-color: #ebebeb;
  border-bottom: 1px solid rgba(72,72,72,0.1);
}
.activeActivity {
  height: auto;

  .arrow {
    -ms-transform: rotate(180deg); /* IE 9 */
    -webkit-transform: rotate(180deg); /* Chrome, Safari, Opera */
    transform: rotate(180deg);
  }
}
</style>
