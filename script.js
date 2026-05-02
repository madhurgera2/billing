const config = window.BILLING_CONFIG;

const form = document.getElementById("invoiceForm");
const itemsContainer = document.getElementById("itemsContainer");
const addItemButton = document.getElementById("addItemButton");
const addCustomItemButton = document.getElementById("addCustomItemButton");
const printButton = document.getElementById("printButton");
const printButtonTop = document.getElementById("printButtonTop");
const resetShipButton = document.getElementById("resetShipButton");
const sameAsBilledCheckbox = document.getElementById("sameAsBilledCheckbox");

const previewNodes = {
  appTitle: document.getElementById("appTitle"),
  appSubtitle: document.getElementById("appSubtitle"),
  summaryItems: document.getElementById("summaryItems"),
  summaryTaxable: document.getElementById("summaryTaxable"),
  summaryGrand: document.getElementById("summaryGrand"),
  previewSellerGstinTop: document.getElementById("previewSellerGstinTop"),
  previewTopNotice: document.getElementById("previewTopNotice"),
  previewCopyType: document.getElementById("previewCopyType"),
  previewInvoiceTitle: document.getElementById("previewInvoiceTitle"),
  previewCompanyName: document.getElementById("previewCompanyName"),
  previewCompanyAddress: document.getElementById("previewCompanyAddress"),
  previewCompanyContacts: document.getElementById("previewCompanyContacts"),
  previewInvoiceNo: document.getElementById("previewInvoiceNo"),
  previewInvoiceDate: document.getElementById("previewInvoiceDate"),
  previewPlaceOfSupply: document.getElementById("previewPlaceOfSupply"),
  previewReverseCharge: document.getElementById("previewReverseCharge"),
  previewBilledToName: document.getElementById("previewBilledToName"),
  previewBilledToAddress: document.getElementById("previewBilledToAddress"),
  previewBilledToGstin: document.getElementById("previewBilledToGstin"),
  previewShippedToName: document.getElementById("previewShippedToName"),
  previewShippedToAddress: document.getElementById("previewShippedToAddress"),
  previewShippedToGstin: document.getElementById("previewShippedToGstin"),
  previewDeliveryNote: document.getElementById("previewDeliveryNote"),
  previewDispatchInfo: document.getElementById("previewDispatchInfo"),
  previewItemsBody: document.getElementById("previewItemsBody"),
  previewTotalQty: document.getElementById("previewTotalQty"),
  previewTotalUnit: document.getElementById("previewTotalUnit"),
  previewGrandTaxable: document.getElementById("previewGrandTaxable"),
  previewTaxBody: document.getElementById("previewTaxBody"),
  previewAmountWords: document.getElementById("previewAmountWords"),
  previewDeclaration: document.getElementById("previewDeclaration"),
  previewRemark: document.getElementById("previewRemark"),
  previewBankDetails: document.getElementById("previewBankDetails"),
  previewBankIfsc: document.getElementById("previewBankIfsc"),
  previewBankAccount: document.getElementById("previewBankAccount"),
  previewTermsTitle: document.getElementById("previewTermsTitle"),
  previewTermsList: document.getElementById("previewTermsList"),
  previewReceiverLabel: document.getElementById("previewReceiverLabel"),
  previewCompanySignatureLine: document.getElementById("previewCompanySignatureLine"),
  previewSignatureText: document.getElementById("previewSignatureText"),
  previewSignatureLabel: document.getElementById("previewSignatureLabel"),
  primaryRateHead: document.getElementById("primaryRateHead"),
  primaryAmountHead: document.getElementById("primaryAmountHead"),
  secondaryRateHead: document.getElementById("secondaryRateHead"),
  secondaryAmountHead: document.getElementById("secondaryAmountHead"),
  taxPrimaryTotalHead: document.getElementById("taxPrimaryTotalHead"),
  taxSecondaryTotalHead: document.getElementById("taxSecondaryTotalHead")
};

const state = {
  items: []
};

function createCustomProductSeed() {
  return {
    name: "",
    hsn: "",
    unit: config.invoice.quantityUnitLabel,
    gstPercent: 18,
    descriptionText: ""
  };
}

function setFormValue(name, value) {
  const field = form.elements.namedItem(name);

  if (field) {
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = value ?? "";
    }
  }
}

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getProductById(productId) {
  return config.products.find((product) => product.id === productId) || config.products[0];
}

function getResolvedProduct(item) {
  if (item.mode === "custom") {
    const custom = item.customProduct || createCustomProductSeed();
    const descriptionLines = String(custom.descriptionText || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      id: item.productId || `custom-${item.id || "item"}`,
      name: custom.name || "Custom Product",
      hsn: custom.hsn || "-",
      unit: custom.unit || config.invoice.quantityUnitLabel,
      gstPercent: Number(custom.gstPercent) || 0,
      descriptionLines
    };
  }

  return getProductById(item.productId);
}

function createProductOptions(selectedProductId) {
  return config.products
    .map((product) => {
      const selected = product.id === selectedProductId ? "selected" : "";
      return `<option value="${product.id}" ${selected}>${product.name}</option>`;
    })
    .join("");
}

function formatCurrency(value) {
  return `${config.invoice.currencySymbol} ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(Number(value || 0)) ? 0 : 2,
    maximumFractionDigits: 2
  });
}

function formatPercent(value) {
  return `${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}%`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateForDisplay(dateInput) {
  if (!dateInput) {
    return "";
  }

  const date = new Date(`${dateInput}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateInput;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function numberToWords(number) {
  if (!number) {
    return "Zero Only";
  }

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = [
    { value: 10000000, label: "Crore" },
    { value: 100000, label: "Lakh" },
    { value: 1000, label: "Thousand" },
    { value: 100, label: "Hundred" }
  ];

  function underHundred(n) {
    if (n < 20) {
      return ones[n];
    }

    const ten = Math.floor(n / 10);
    const rest = n % 10;
    return `${tens[ten]}${rest ? ` ${ones[rest]}` : ""}`.trim();
  }

  function underThousand(n) {
    if (n < 100) {
      return underHundred(n);
    }

    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    return `${ones[hundred]} Hundred${rest ? ` ${underHundred(rest)}` : ""}`.trim();
  }

  function convert(n) {
    if (n < 1000) {
      return underThousand(n);
    }

    for (const scale of scales) {
      if (n >= scale.value) {
        const major = Math.floor(n / scale.value);
        const rest = n % scale.value;
        return `${convert(major)} ${scale.label}${rest ? ` ${convert(rest)}` : ""}`.trim();
      }
    }

    return "";
  }

  return `${convert(Math.round(number))} Only`;
}

function setText(node, value) {
  node.textContent = value || "";
}

function setMultilineText(node, value) {
  node.innerHTML = String(value || "").replaceAll("\n", "<br />");
}

function createNewItem(mode = "catalog") {
  const firstProduct = config.products[0];

  if (mode === "custom") {
    return {
      mode: "custom",
      productId: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      customProduct: {
        ...createCustomProductSeed()
      }
    };
  }

  return {
    mode: "catalog",
    productId: firstProduct.id,
    quantity: 1,
    rate: firstProduct.defaultRate,
    discount: firstProduct.defaultDiscount || 0,
    customProduct: {
      ...createCustomProductSeed()
    }
  };
}

function getItemCardMarkup(item, index) {
  const product = getResolvedProduct(item);
  const isCustomMode = item.mode === "custom";
  const details = escapeHtml((product.descriptionLines || []).join(" | "));

  return `
    <article class="item-card ${isCustomMode ? "custom-mode" : ""}" data-item-index="${index}">
      <div class="item-card-header">
        <div class="item-card-meta">
          <h3>Item ${index + 1}</h3>
          <span class="mode-badge">${isCustomMode ? "Custom Product" : "Catalog Product"}</span>
        </div>
        <div class="item-card-meta">
          <div class="mode-switch">
            <button type="button" class="mode-chip ${!isCustomMode ? "active" : ""}" data-mode="catalog">From Catalog</button>
            <button type="button" class="mode-chip ${isCustomMode ? "active" : ""}" data-mode="custom">Custom Product</button>
          </div>
          <button type="button" class="danger-button remove-item-button">Remove</button>
        </div>
      </div>
      <div class="item-grid">
        ${
          isCustomMode
            ? `
              <div class="readonly-chip">
                <strong>Custom Product</strong>
                <small>This item uses the product details entered below instead of the catalog.</small>
              </div>
            `
            : `
              <label>
                Product
                <select class="item-product-select">
                  ${createProductOptions(product.id)}
                </select>
              </label>
            `
        }
        <label>
          Quantity
          <input class="item-quantity-input" type="number" min="0" step="0.01" value="${item.quantity}" />
        </label>
        <label>
          Final Price
          <input class="item-rate-input" type="number" min="0" step="0.01" value="${item.rate}" />
        </label>
        <label>
          Discount
          <input class="item-discount-input" type="number" min="0" step="0.01" value="${item.discount}" />
        </label>
        <div class="readonly-chip">
          <strong>GST %</strong>
          <span>${formatPercent(product.gstPercent)}</span>
        </div>
        <div class="readonly-chip">
          <strong>HSN / SAC</strong>
          <span>${escapeHtml(product.hsn)}</span>
        </div>
        <div class="readonly-chip">
          <strong>Unit</strong>
          <span>${escapeHtml(product.unit || config.invoice.quantityUnitLabel)}</span>
        </div>
        <div class="readonly-chip">
          <strong>Description</strong>
          <small>${details || escapeHtml(product.name)}</small>
        </div>
      </div>
      ${
        isCustomMode
          ? `
            <div class="custom-product-grid">
              <label>
                Product Name
                <input class="custom-name-input" type="text" value="${escapeHtml(item.customProduct?.name || "")}" placeholder="Enter custom product name" />
              </label>
              <label>
                HSN / SAC
                <input class="custom-hsn-input" type="text" value="${escapeHtml(item.customProduct?.hsn || "")}" placeholder="Enter HSN code" />
              </label>
              <label>
                Unit
                <input class="custom-unit-input" type="text" value="${escapeHtml(item.customProduct?.unit || config.invoice.quantityUnitLabel)}" placeholder="Pcs." />
              </label>
              <label>
                GST Percent
                <input class="custom-gst-input" type="number" min="0" step="0.01" value="${item.customProduct?.gstPercent ?? 18}" />
              </label>
              <label class="span-two">
                Product Description
                <textarea class="custom-description-input" rows="3" placeholder="One detail per line">${escapeHtml(item.customProduct?.descriptionText || "")}</textarea>
              </label>
              <p class="custom-product-note span-two">The custom product details entered here are used directly in the rendered bill and tax calculation.</p>
            </div>
          `
          : ""
      }
    </article>
  `;
}

function renderItemCards() {
  itemsContainer.innerHTML = state.items
    .map((item, index) => getItemCardMarkup(item, index))
    .join("");
}

function syncItemEvents() {
  itemsContainer.querySelectorAll(".item-card").forEach((card) => {
    const index = Number(card.dataset.itemIndex);
    const productSelect = card.querySelector(".item-product-select");
    const quantityInput = card.querySelector(".item-quantity-input");
    const rateInput = card.querySelector(".item-rate-input");
    const discountInput = card.querySelector(".item-discount-input");
    const removeButton = card.querySelector(".remove-item-button");
    const modeButtons = card.querySelectorAll(".mode-chip");
    const customNameInput = card.querySelector(".custom-name-input");
    const customHsnInput = card.querySelector(".custom-hsn-input");
    const customUnitInput = card.querySelector(".custom-unit-input");
    const customGstInput = card.querySelector(".custom-gst-input");
    const customDescriptionInput = card.querySelector(".custom-description-input");

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetMode = button.dataset.mode;
        const currentItem = state.items[index];

        if (currentItem.mode === targetMode) {
          return;
        }

        if (targetMode === "custom") {
          state.items[index] = {
            ...currentItem,
            mode: "custom",
            customProduct: {
              ...(currentItem.customProduct || createCustomProductSeed()),
              name: currentItem.customProduct?.name || "",
              hsn: currentItem.customProduct?.hsn || "",
              unit: currentItem.customProduct?.unit || config.invoice.quantityUnitLabel,
              gstPercent: currentItem.customProduct?.gstPercent ?? 18,
              descriptionText: currentItem.customProduct?.descriptionText || ""
            }
          };
        } else {
          const fallbackProduct = getProductById(currentItem.productId || config.products[0].id);
          state.items[index] = {
            ...currentItem,
            mode: "catalog",
            productId: fallbackProduct.id,
            rate: currentItem.rate || fallbackProduct.defaultRate,
            discount: currentItem.discount || fallbackProduct.defaultDiscount || 0
          };
        }

        renderAll();
      });
    });

    if (productSelect) {
      productSelect.addEventListener("change", (event) => {
        const product = getProductById(event.target.value);
        state.items[index].productId = product.id;
        state.items[index].rate = product.defaultRate;
        state.items[index].discount = product.defaultDiscount || 0;
        renderAll();
      });
    }

    quantityInput.addEventListener("input", (event) => {
      state.items[index].quantity = Number(event.target.value) || 0;
      updatePreview();
    });

    rateInput.addEventListener("input", (event) => {
      state.items[index].rate = Number(event.target.value) || 0;
      updatePreview();
    });

    discountInput.addEventListener("input", (event) => {
      state.items[index].discount = Number(event.target.value) || 0;
      updatePreview();
    });

    if (customNameInput) {
      customNameInput.addEventListener("input", (event) => {
        state.items[index].customProduct.name = event.target.value;
        updatePreview();
      });
    }

    if (customHsnInput) {
      customHsnInput.addEventListener("input", (event) => {
        state.items[index].customProduct.hsn = event.target.value;
        updatePreview();
      });
    }

    if (customUnitInput) {
      customUnitInput.addEventListener("input", (event) => {
        state.items[index].customProduct.unit = event.target.value;
        updatePreview();
      });
    }

    if (customGstInput) {
      customGstInput.addEventListener("input", (event) => {
        state.items[index].customProduct.gstPercent = Number(event.target.value) || 0;
        updatePreview();
      });
    }

    if (customDescriptionInput) {
      customDescriptionInput.addEventListener("input", (event) => {
        state.items[index].customProduct.descriptionText = event.target.value;
        updatePreview();
      });
    }

    removeButton.addEventListener("click", () => {
      state.items.splice(index, 1);

      if (!state.items.length) {
        state.items.push(createNewItem());
      }

      renderAll();
    });
  });
}

function populateFormDefaults() {
  Object.entries(config.defaults).forEach(([key, value]) => {
    setFormValue(key, value);
  });

  setFormValue("invoiceDate", getTodayInputValue());
}

function syncShipToFromBillTo() {
  const mappings = [
    ["billedToName", "shippedToName"],
    ["billedToAddress", "shippedToAddress"],
    ["billedToGstin", "shippedToGstin"]
  ];

  mappings.forEach(([source, target]) => {
    const sourceField = form.elements.namedItem(source);
    const targetField = form.elements.namedItem(target);

    if (sourceField && targetField) {
      targetField.value = sourceField.value;
    }
  });
}

function setShipFieldsDisabled(disabled) {
  ["shippedToName", "shippedToAddress", "shippedToGstin"].forEach((name) => {
    const field = form.elements.namedItem(name);

    if (field) {
      field.disabled = disabled;
    }
  });
}

function collectFormData() {
  const formData = Object.fromEntries(new FormData(form).entries());
  formData.sameAsBilled = sameAsBilledCheckbox.checked;

  if (formData.sameAsBilled) {
    formData.shippedToName = formData.billedToName;
    formData.shippedToAddress = formData.billedToAddress;
    formData.shippedToGstin = formData.billedToGstin;
  }

  return formData;
}

function computeInvoiceData(formData) {
  const buyerStateCode = extractStateCode(formData.placeOfSupply) || config.invoice.companyStateCode;
  const isIntraState = buyerStateCode === config.invoice.companyStateCode;
  const taxMode = isIntraState ? "split" : "integrated";

  const items = state.items.map((item, index) => {
    const product = getResolvedProduct(item);
    const quantity = Number(item.quantity) || 0;
    const unit = product.unit || config.invoice.quantityUnitLabel;
    const rate = Number(item.rate) || 0;
    const grossAmount = quantity * rate;
    const discount = Math.min(Number(item.discount) || 0, grossAmount);
    const finalAmount = grossAmount - discount;
    const gstPercent = Number(product.gstPercent) || 0;
    const taxableAmount = gstPercent ? finalAmount / (1 + gstPercent / 100) : finalAmount;
    const totalTax = finalAmount - taxableAmount;
    const primaryRate = taxMode === "split" ? gstPercent / 2 : gstPercent;
    const secondaryRate = taxMode === "split" ? gstPercent / 2 : 0;
    const primaryTaxAmount = taxMode === "split" ? totalTax / 2 : totalTax;
    const secondaryTaxAmount = taxMode === "split" ? totalTax / 2 : 0;

    return {
      index: index + 1,
      name: product.name,
      descriptionLines: product.descriptionLines || [],
      hsn: product.hsn,
      unit,
      quantity,
      rate,
      discount,
      finalAmount,
      taxableAmount,
      gstPercent,
      primaryRate,
      secondaryRate,
      primaryTaxAmount,
      secondaryTaxAmount,
      totalTax
    };
  });

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const taxableTotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  const primaryTaxTotal = items.reduce((sum, item) => sum + item.primaryTaxAmount, 0);
  const secondaryTaxTotal = items.reduce((sum, item) => sum + item.secondaryTaxAmount, 0);
  const grandTax = primaryTaxTotal + secondaryTaxTotal;
  const grandTotal = items.reduce((sum, item) => sum + item.finalAmount, 0);
  const unitLabel = items[0]?.unit || config.invoice.quantityUnitLabel;

  const taxBreakdown = items.reduce((map, item) => {
    const current = map.get(item.hsn) || {
      hsn: item.hsn,
      taxRate: item.gstPercent,
      mainQty: 0,
      uqc: item.unit,
      taxableAmount: 0,
      primaryTaxAmount: 0,
      secondaryTaxAmount: 0,
      totalTax: 0
    };

    current.mainQty += item.quantity;
    current.taxableAmount += item.taxableAmount;
    current.primaryTaxAmount += item.primaryTaxAmount;
    current.secondaryTaxAmount += item.secondaryTaxAmount;
    current.totalTax += item.totalTax;
    map.set(item.hsn, current);
    return map;
  }, new Map());

  return {
    taxMode,
    items,
    totalQty,
    taxableTotal,
    primaryTaxTotal,
    secondaryTaxTotal,
    grandTax,
    grandTotal,
    unitLabel,
    taxBreakdown: Array.from(taxBreakdown.values())
  };
}

function extractStateCode(value) {
  const match = String(value || "").match(/\((\d{2})\)|\b(\d{2})\b/);
  return match?.[1] || match?.[2] || "";
}

function updateSummary(invoiceData) {
  setText(previewNodes.summaryItems, String(invoiceData.items.length));
  setText(previewNodes.summaryTaxable, formatCurrency(invoiceData.taxableTotal));
  setText(previewNodes.summaryGrand, formatCurrency(invoiceData.grandTotal));
}

function updatePreview() {
  const formData = collectFormData();
  const invoiceData = computeInvoiceData(formData);
  const primaryLabel = invoiceData.taxMode === "split" ? "CGST" : "IGST";
  const secondaryLabel = invoiceData.taxMode === "split" ? "SGST" : "";

  updateSummary(invoiceData);
  setText(previewNodes.appTitle, config.app.title);
  setText(previewNodes.appSubtitle, config.app.subtitle);

  setText(previewNodes.previewSellerGstinTop, config.seller.gstin);
  setText(previewNodes.previewTopNotice, config.invoice.topNotice);
  setText(previewNodes.previewCopyType, config.invoice.copyType);
  setText(previewNodes.previewInvoiceTitle, config.invoice.title);
  setText(previewNodes.previewCompanyName, config.seller.name);
  setMultilineText(previewNodes.previewCompanyAddress, config.seller.addressLines.join("\n"));
  setText(
    previewNodes.previewCompanyContacts,
    [config.seller.phoneLine, config.seller.emailLine].filter(Boolean).join("   ")
  );

  setText(previewNodes.previewInvoiceNo, formData.invoiceNo);
  setText(previewNodes.previewInvoiceDate, formatDateForDisplay(formData.invoiceDate));
  setText(previewNodes.previewPlaceOfSupply, formData.placeOfSupply);
  setText(previewNodes.previewReverseCharge, formData.reverseCharge);
  setText(previewNodes.previewBilledToName, formData.billedToName);
  setMultilineText(previewNodes.previewBilledToAddress, formData.billedToAddress);
  setText(previewNodes.previewBilledToGstin, formData.billedToGstin);
  setText(previewNodes.previewShippedToName, formData.shippedToName);
  setMultilineText(previewNodes.previewShippedToAddress, formData.shippedToAddress);
  setText(previewNodes.previewShippedToGstin, formData.shippedToGstin);
  setText(previewNodes.previewDeliveryNote, formData.deliveryNote);
  setText(previewNodes.previewDispatchInfo, formData.dispatchInfo);

  previewNodes.primaryRateHead.textContent = `${primaryLabel} Rate`;
  previewNodes.primaryAmountHead.textContent = `${primaryLabel} Amount`;
  previewNodes.secondaryRateHead.textContent = secondaryLabel ? `${secondaryLabel} Rate` : "";
  previewNodes.secondaryAmountHead.textContent = secondaryLabel ? `${secondaryLabel} Amount` : "";
  previewNodes.taxPrimaryTotalHead.textContent = `${primaryLabel} Amt.`;
  previewNodes.taxSecondaryTotalHead.textContent = secondaryLabel ? `${secondaryLabel} Amt.` : "";

  previewNodes.previewItemsBody.innerHTML = invoiceData.items
    .map((item) => {
      const description = `
        <div class="desc-main">${item.name}</div>
        <div class="desc-lines">${item.descriptionLines.join("\n")}</div>
      `;

      return `
        <tr>
          <td>${item.index}</td>
          <td>${description}</td>
          <td>${item.hsn}</td>
          <td>${formatNumber(item.quantity)}</td>
          <td>${item.unit}</td>
          <td>${formatCurrency(item.rate)}</td>
          <td>${formatCurrency(item.discount)}</td>
          <td>${formatPercent(item.primaryRate)}</td>
          <td>${formatCurrency(item.primaryTaxAmount)}</td>
          <td>${secondaryLabel ? formatPercent(item.secondaryRate) : ""}</td>
          <td>${secondaryLabel ? formatCurrency(item.secondaryTaxAmount) : ""}</td>
          <td>${formatCurrency(item.finalAmount)}</td>
        </tr>
      `;
    })
    .join("");

  setText(previewNodes.previewTotalQty, formatNumber(invoiceData.totalQty));
  setText(previewNodes.previewTotalUnit, invoiceData.unitLabel);
  setText(previewNodes.previewGrandTaxable, formatCurrency(invoiceData.grandTotal));

  previewNodes.previewTaxBody.innerHTML = invoiceData.taxBreakdown
    .map(
      (entry) => `
        <tr>
          <td>${entry.hsn}</td>
          <td>${formatPercent(entry.taxRate)}</td>
          <td>${formatNumber(entry.mainQty)}</td>
          <td>${entry.uqc}</td>
          <td>${formatCurrency(entry.taxableAmount)}</td>
          <td>${formatCurrency(entry.primaryTaxAmount)}</td>
          <td>${secondaryLabel ? formatCurrency(entry.secondaryTaxAmount) : ""}</td>
          <td>${formatCurrency(entry.totalTax)}</td>
        </tr>
      `
    )
    .join("");

  setText(
    previewNodes.previewAmountWords,
    `Rupees ${numberToWords(invoiceData.grandTotal)}`
  );
  setText(previewNodes.previewDeclaration, formData.declarationText || config.compliance.declaration);
  setText(previewNodes.previewRemark, formData.remarkText);
  setText(previewNodes.previewBankDetails, `${config.bank.bankName} , ${config.bank.branch}`);
  setText(previewNodes.previewBankIfsc, config.bank.ifsc);
  setText(previewNodes.previewBankAccount, config.bank.accountNumber);
  setText(previewNodes.previewTermsTitle, config.invoice.termsTitle);
  previewNodes.previewTermsList.innerHTML = config.terms
    .map((term) => `<li>${term}</li>`)
    .join("");
  setText(previewNodes.previewReceiverLabel, previewNodes.previewReceiverLabel.textContent || config.invoice.receiverLabel);
  setText(previewNodes.previewReceiverLabel, config.invoice.receiverLabel);
  setText(previewNodes.previewCompanySignatureLine, `for ${config.seller.name}`);
  setText(previewNodes.previewSignatureText, config.seller.name);
  setText(previewNodes.previewSignatureLabel, config.invoice.signatureLabel);
}

function renderAll() {
  renderItemCards();
  syncItemEvents();
  updatePreview();
}

function initState() {
  state.items = config.initialItems.map((item) => ({
    mode: item.mode || "catalog",
    productId: item.productId,
    quantity: item.quantity,
    rate: item.rate,
    discount: item.discount || 0,
    customProduct: {
      ...createCustomProductSeed(),
      descriptionText: "",
      ...(item.customProduct || {})
    }
  }));

  if (!state.items.length) {
    state.items.push(createNewItem());
  }
}

function printInvoice() {
  window.print();
}

function attachEvents() {
  addItemButton.addEventListener("click", () => {
    state.items.push(createNewItem("catalog"));
    renderAll();
  });

  addCustomItemButton.addEventListener("click", () => {
    state.items.push(createNewItem("custom"));
    renderAll();
  });

  resetShipButton.addEventListener("click", () => {
    syncShipToFromBillTo();
    updatePreview();
  });

  sameAsBilledCheckbox.addEventListener("change", () => {
    const shouldSync = sameAsBilledCheckbox.checked;
    setShipFieldsDisabled(shouldSync);

    if (shouldSync) {
      syncShipToFromBillTo();
    }

    updatePreview();
  });

  ["billedToName", "billedToAddress", "billedToGstin"].forEach((name) => {
    const field = form.elements.namedItem(name);
    field.addEventListener("input", () => {
      if (sameAsBilledCheckbox.checked) {
        syncShipToFromBillTo();
        updatePreview();
      }
    });
  });

  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);
  printButton.addEventListener("click", printInvoice);
  printButtonTop.addEventListener("click", printInvoice);
}

function init() {
  populateFormDefaults();
  initState();
  setShipFieldsDisabled(sameAsBilledCheckbox.checked);
  attachEvents();
  renderAll();
}

init();
