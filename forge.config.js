module.exports = {
  packagerConfig: {},
  makers: [
      // {
      //   "name": "@electron-forge/maker-squirrel",
      //   "config": {
      //     "name": "electron_quick_start"
      //   }
      // },
      // {
      //   "name": "@electron-forge/maker-zip",
      //   "platforms": [
      //     "darwin"
      //   ]
      // },
      {
        "name": "@electron-forge/maker-deb",
        "config": {}
      },
      // {
      //   "name": "@electron-forge/maker-rpm",
      //   "config": {}
      // }
  ]
}