import axios from "@/http/request";


export function formatCityList(list) {
  const cityList = {};
  list.forEach(item => {
    const key = item.short.substring(0, 1);
    if(!cityList[key]) {
      cityList[key] = [item];
    } else {
      cityList[key].push(item)
    }
  });
  // 获取索引数据
  const cityKey = Object.keys(cityList).sort();
  return {
    cityList, cityKey
  }
}


export function getCurCity() {
  const localCity = JSON.parse(localStorage.getItem("curCity"));
  
  if(!localCity) {
    return new Promise((resolve, reject) => {
      try {
        const map = new window.BMapGL.LocalCity();
        map.get(async ({name}) => {
          const { data } = await axios.get('/area/info', {
            params: {
              "name": name
            }
          });
          localStorage.setItem("curCity", JSON.stringify(data.body))
          resolve(data.body);
        })
      } catch(e) {
        reject(e);
      }
    })
  }
  return Promise.resolve(localCity);
}

export function formatCityLetter(letter) {
  switch(letter) {
    case "#":
      return "当前定位";
      break;
    case "hot":
      return "热门";
      break;
    default:
      return letter.toLocaleUpperCase();
      break;
  }
}

export function debounce(fn, timer, triggle) {
  let t = null;
  return function() {
    const _self = this,
          args = arguments;
    if(t) {
      clearTimeout(t)
    }
    if(triggle) {
      const exec = !t;
      t = setTimeout(() => {
        t = null;
      }, timer);
      if(exec) {
        fn.apply(_self, args);
      }
    } else {
      t = setTimeout(() => {
        fn.apply(_self, args);
      }, timer)
    }
  }
}