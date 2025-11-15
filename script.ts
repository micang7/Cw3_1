interface Country {
  name: {
    common: string;
  };
  capital?: string[];
  population?: number;
  region?: string;
  subregion?: string;
  languages?: {
    [key: string]: string;
  }
}

const input = document.querySelector("#country-input") as HTMLInputElement;
const regionInput = document.querySelector("#region-input") as HTMLSelectElement;
const country_btn = document.querySelector("#country-btn") as HTMLButtonElement;
const region_btn = document.querySelector("#region-btn") as HTMLButtonElement;
const table = document.querySelector("table") as HTMLTableElement;

country_btn.addEventListener("click", async (e: MouseEvent) => {
  e.preventDefault();

  showLoadingPopup("Pobieranie danych...");

  const country = input.value.trim();

  try {
    const resp = await fetch(
      `https://restcountries.com/v3.1/${
        country
          ? `name/${country}`
          : "all?fields=name,capital,population,region,languages"
      }`
    );
    table.innerHTML = `<thead>
      <tr>
        <th>Name</th>
        <th>Capital</th>
        <th>Population</th>
        <th>Region</th>
        <th>Languages</th>
      </tr>
    </thead>`;
    if (resp.ok) {
      const data: Country[] = await resp.json();
      // console.log(data);
      let rows = "";
      data.forEach((country) => {
        rows += `<tr>
        <td>${country.name.common}</td>
        <td>${country.capital?.join(", ") || "-"}</td>
        <td>${country.population || "0"}</td>
        <td>${country.region || "-"}</td>
        <td>${Object.values(country.languages ?? {}).join(", ") || "-"}</td>
      </tr>`;
      });
      table.innerHTML += `<tbody>${rows}</tbody>`;
    } else if (resp.status === 404) {
      table.innerHTML += `<tbody><tr><td colspan="5" style="text-align:center">Brak wyników wyszukiwania</td></tr></tbody>`;
    } else {
      alert("Nie udało się pobrać danych z API.");
    }
  } catch (error) {
    alert(error?.message || "Nieznany błąd.");
  } finally {
    hideLoadingPopup();
  }
});

region_btn.addEventListener("click", async (e) => {
  e.preventDefault();

  showLoadingPopup("Pobieranie danych...");

  const region = regionInput.value;

  try {
    const resp = await fetch(
      `https://restcountries.com/v3.1/${
        region
          ? `region/${region}`
          : "all?fields=name,capital,population,subregion"
      }`
    );
    table.innerHTML = `<thead>
      <tr>
        <th>Name</th>
        <th>Capital</th>
        <th>Population</th>
        <th>Subregion</th>
      </tr>
    </thead>`;
    if (resp.ok) {
      const data: Country[] = await resp.json();
      // console.log(data);
      let rows = "";
      data
        .toSorted((a, b) => a.name.common.localeCompare(b.name.common))
        .forEach((country: Country) => {
          rows += `<tr>
        <td>${country.name.common}</td>
        <td>${country.capital?.join(", ") || "-"}</td>
        <td>${country.population || "0"}</td>
        <td>${country.subregion || "-"}</td>
      </tr>`;
        });
      table.innerHTML += `<tbody>${rows}</tbody>`;
    } else if (resp.status === 404) {
      table.innerHTML += `<tbody><tr><td colspan="5" style="text-align:center">Brak wyników wyszukiwania</td></tr></tbody>`;
    } else {
      alert("Nie udało się pobrać danych z API.");
    }
  } catch (error) {
    alert(error?.message || "Nieznany błąd.");
  } finally {
    hideLoadingPopup();
  }
});

function showLoadingPopup(title: string) {
  const popup = document.createElement("div");
  popup.classList.add("loading-popup");
  popup.textContent = title;
  document.body.appendChild(popup);
}

function hideLoadingPopup() {
  const popup = document.querySelector(".loading-popup");
  if (popup) document.body.removeChild(popup);
}