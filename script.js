const input = document.querySelector("#country-input");
const button = document.querySelector("button");
const tbody = document.querySelector("tbody");

button.addEventListener("click", async (e) => {
  e.preventDefault();

  showLoadingPopup("Pobieranie danych...");

  const country = input.value.trim();

  try {
    const resp = await fetch(
      `https://restcountries.com/v3.1/${country ? `name/${country}` : "all?fields=name,capital,population,region,languages"}`,
    );
    if (resp.ok) {
      const data = await resp.json();
      // console.log(data);
      let rows = "";
      data.forEach((country) => {
        rows += `<tr>
        <td>${country.name.common}</td>
        <td>${country.capital?.join(", ") || "-"}</td>
        <td>${country.population || "0"}</td>
        <td>${country.region || "-"}</td>
        <td>${Object.values(country.languages).join(", ") || "-"}</td>
      </tr>`;
        tbody.innerHTML = rows;
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

function showLoadingPopup(title) {
  const popup = document.createElement("div");
  popup.classList.add("loading-popup");
  popup.textContent = title;
  document.body.appendChild(popup);
}

function hideLoadingPopup() {
  const popup = document.querySelector(".loading-popup");
  if (popup) document.body.removeChild(popup);
}
