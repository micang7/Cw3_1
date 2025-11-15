interface Country {
  name: {
    common: string;
  };
  capital?: string[];
  population?: number;
  region?: string;
  subregion?: string;
  currencies?: Record<string, { name: string; symbol: string }>;
  flags?: {
    png: string;
  };
}

const input = document.querySelector("#capital-input") as HTMLInputElement;
const button = document.querySelector("button") as HTMLButtonElement;
const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
const details = document.querySelector("#details") as HTMLDivElement;

button.addEventListener("click", async (e) => {
  e.preventDefault();

  showLoadingPopup("Pobieranie danych...");

  const capital = input.value.trim();

  try {
    const resp = await fetch(
      `https://restcountries.com/v3.1/${capital ? `capital/${capital}` : "all?fields=name,capital,population,region,subregion,currencies,flags"}`,
    );
    if (resp.ok) {
      const data: Country[] = await resp.json();
      // console.log(data);
      data.forEach((country) => {
        const trow = document.createElement("tr");
        trow.innerHTML = `<td>${country.name.common}</td>
        <td>${country.capital?.join(", ") || "-"}</td>
        <td>${country.population || "0"}</td>
        <td>${country.region || "-"}</td>
        <td>${country.subregion || "-"}</td>`;
        tbody.appendChild(trow);
        trow.addEventListener("click", () => {
          details.innerHTML = `<h3>${country.name.common}</h3>
          <p>Waluta: ${Object.keys(country.currencies ?? {}).join(", ")}</p>
          <img src="${country.flags?.png}" alt="flaga"/>`;
        });
      });
    } else if (resp.status === 404) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Brak wyników wyszukiwania</td></tr>`;
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
