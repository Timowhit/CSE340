const invModel = require('../models/inventory-model')

/* ========================================
   Build classification grid HTML
   ======================================== */
async function buildClassificationGrid(data) {
  let grid = ''
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${Number(vehicle.inv_price).toLocaleString('en-US')}</span>
        </div>
      </li>`
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ========================================
   Build vehicle detail HTML
   ======================================== */
function buildVehicleDetail(vehicle) {
  const price = Number(vehicle.inv_price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const mileage = Number(vehicle.inv_miles).toLocaleString('en-US')

  return `
  <section id="vehicle-detail">
    <div id="detail-image">
      <img
        src="${vehicle.inv_image}"
        alt="${vehicle.inv_make} ${vehicle.inv_model} full-size view"
        width="600"
        height="400"
      />
    </div>
    <div id="detail-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <ul id="detail-specs">
        <li><span class="detail-label">Price:</span> <span class="detail-value price">${price}</span></li>
        <li><span class="detail-label">Mileage:</span> <span class="detail-value">${mileage} miles</span></li>
        <li><span class="detail-label">Color:</span> <span class="detail-value">${vehicle.inv_color}</span></li>
        <li><span class="detail-label">Year:</span> <span class="detail-value">${vehicle.inv_year}</span></li>
        <li><span class="detail-label">Make:</span> <span class="detail-value">${vehicle.inv_make}</span></li>
        <li><span class="detail-label">Model:</span> <span class="detail-value">${vehicle.inv_model}</span></li>
        <li><span class="detail-label">Description:</span> <span class="detail-value">${vehicle.inv_description}</span></li>
      </ul>
      <a href="/contact" class="btn-primary">Contact Us About This Vehicle</a>
    </div>
  </section>`
}

module.exports = { buildClassificationGrid, buildVehicleDetail }