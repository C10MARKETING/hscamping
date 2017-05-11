<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
body {
  font-size: 14px;
  color: #556b79;
  background: #d9e0df;
  font-family: 'Raleway', Helvetica, sans-serif;
}
#app {
  padding: 0;
  margin: 20px;
}
[v-cloak] {
  display: none;
}
.tabs {
  display: flex;
  margin-bottom: 30px;
}
.tabs {
  .active {
    color: #ACC6C7;
    background-color: #556b79;     
  }
  div {
    color: #556b79;
    padding: 10px;
    margin-right: 20px;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
    background-color: #ACC6C7;
    user-select: none;
    &:hover{
      color: #ACC6C7;
      background-color: #556b79;
    }
  }
}
table, input, select, button, textarea {
  font-size: inherit;
  font-family: inherit;
}
input[type="text"],input[type="number"], select, textarea {
  border: 1px solid #d2d2d2;
}
span.time-picker {
   font-family: 'Raleway', Helvetica, sans-serif;

   input.display-time {
     height: 30px;
     cursor: pointer;
   }
   .dropdown {
     top: 32px;

     ul {

      li {
        &:hover {
          background: #ACC6C7 !important;
        }
      }
     
      li.active {
        background: #556b79;
        &:hover {
          background: #556b79 !important;
        }
      }

     }
   }
 }
textarea {
  padding: 5px;
}
button, td {
  padding: 3px;
}
select {
  padding: 4px;
}
input {
  padding: 6px;
}
label {
  cursor:pointer;
}
td {
  vertical-align: top;

  &:first-child {
    font-weight: bold;
  }
}
td:first-child {
  font-weight: bold;
}
img.preview {
  height: 60px;
  display: block;
}
table.edit-activity {
  width: auto;
  display: inline-table;

  td:first-child {
    min-width: 200px;
  }

  td:last-child {
    padding-right: 20px;
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
.search {
  display: flex;
  margin-bottom: 15px;
  input {
    border: 1px solid #556b79;
    padding: 8px;
    font-size: 1.2em;
    display:inline-block;
    margin-right: 10px;
  }
  img {
    cursor: pointer;
  }
}
.participants {
  display: flex;
  flex-wrap: wrap;
}
.participant {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  padding: 8px;
  padding-right: 45px;
  margin: 10px 10px 0 0;
  background: #fff;
  cursor: pointer;
  font-size: 1.1em;
  user-select: none;
  box-sizing: border-box;

  span {
    display: inline-flex;
    justify-content: center;
    margin-left: 5px;
  }

  &:hover {

    border-bottom: 2px solid #ACC6C7;
    padding-bottom: 6px;

    .removeButton {
      visibility: visible;
    }
  }
}
.removeButton {
  position: absolute;
  right: 0;
  display: inline-flex;
  justify-content: center;
  visibility: hidden;
  margin-left: 15px;
  height: 35px;
  width: 35px;
  &:hover {
    background: #ACC6C7;
  }
}
.confirmed {
  background-color: #baddb3;
}
.addParticipant {
    border: 1px solid #556b79;
    padding: 8px;
    font-size: 1.2em;
    display:inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
}
.date {
  margin-bottom: 10px;
}
.activity.past {
  opacity: 0.6;
}
.activity {
  width: 360px;
  height: 120px;
  background-color: #ACC6C7;
  display: inline-flex;
  margin: 10px 10px 0 0;

  img {
    height: 100%;
    min-width: 120px;
    max-width: 120px;
  }

  .content {
    position: relative;
    flex-grow: 1;
  }

  .edit {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 8px 10px;
    color: #ACC6C7;
    background-color: #556b79;
    z-index: 2;

    &:hover {
      color: #fff;
      cursor: pointer;
    }
  }

  .translated-da {
    font-size: 0.9em;
    position: absolute;
    bottom: 5px;
    left: 50%;
    margin-left: -30px;
  }

  .translated-de {
    font-size: 0.9em;
    position: absolute;
    bottom: 5px;
    left: 50%;
    margin-left: 30px;
  }

  .series {
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px 5px;
    color: #ACC6C7;
    background-color: #556b79;
    z-index: 2;
    opacity: 0.5;

    &:hover {
      color: #fff;
      cursor: pointer;
    }
  }

  .delete {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 8px 10px;
    color: #ACC6C7;
    background-color: #556b79;
    z-index: 2;

    &:hover {
      color: #fff;
      cursor: pointer;
    }
  }

  .title {
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    text-transform: uppercase;
  }
}
.content {
  padding: 10px;

  div {
    margin-bottom: 5px;
  }
}
.lang-dropdown {
  border: 0px;
  background-color: transparent;
  font-weight: bold;
  color: #556b79;
  margin-left: -8px;
  margin-top: -4px;
}
.spinner {
    border: 3px solid #ACC6C7; /* Light grey */
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
.hint {
  display: none;
}
.flatpickr-placeholder {
  position: relative;
  width: 220px;
  left: 30px;
  top: 11px;
  user-select: none;
  pointer-events: none;
  color: #556b79;
  font-weight: bold;
  text-transform: uppercase;
}
.search .flatpickr-input {
  margin-left: -220px;
  width: 200px;
  font-size: 0;

  background-color: #ACC6C7;
  border: 0;

  &:hover {
    color: #ACC6C7;
    border-bottom: 2px solid #556b79;
  }
}
.repeatDays {
  div {
    padding: 5px 0 0 0;
  }
}
</style>
