interface Country {
  name: {
    common: string;
  };
  capital?: string[];
  population?: number;
  region?: string;
  subregion?: string;
}

const input = document.querySelector("#capital-input") as HTMLInputElement;
const button = document.querySelector("button") as HTMLButtonElement;
const tbody = document.querySelector("tbody") as HTMLTableSectionElement;

button.addEventListener("click", async (e: MouseEvent) => {
  e.preventDefault();

  showLoadingPopup("Pobieranie danych...");

  const capital = input.value.trim();

  try {
    const resp = await fetch(
      `https://restcountries.com/v3.1/${capital ? `capital/${capital}` : "all?fields=name,capital,population,region,subregion"}`,
    );
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
        <td>${country.subregion || "-"}</td>
      </tr>`;
        tbody.innerHTML = rows;
      });
    } else if (resp.status === 404) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Brak wyników wyszukiwania</td></tr>`;
    } else {
      alert("Nie udało się pobrać danych z API.");
    }
  } catch (error) {
    alert(error instanceof Error ? error.message : "Nieznany błąd.");
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
