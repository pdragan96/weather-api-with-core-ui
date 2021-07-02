import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
// Forms
import { EsCheckboxComponent } from './components/es-checkbox/es-checkbox.component';
import { EsDatePickerComponent } from './components/es-date-picker/es-date-picker.component';
import { EsGroupedListPickerComponent } from './components/es-grouped-list-picker/es-grouped-list-picker.component';
import { EsMultiSelectComponent } from './components/es-multi-select/es-multi-select.component';
import { EsNumberFieldComponent } from './components/es-number-field/es-number-field.component';
import { EsRangePickerComponent } from './components/es-range-picker/es-range-picker.component';
import { EsSelectComponent } from './components/es-select/es-select.component';
import { EsSwitchComponent } from './components/es-switch/es-switch.component';
import { EsTextFieldComponent } from './components/es-text-field/es-text-field.component';
import { EsRadiobuttonComponent } from './components/es-radiobutton/es-radiobutton.component';
import { EsRangeSliderComponent } from './components/es-range-slider/es-range-slider.component';
// Entry Components
import { EsTooltipComponent } from './directives/es-tooltip/component/es-tooltip.component';
// Components
import { EsAccordionComponent } from './components/es-accordion/es-accordion.component';

import { EsDataTableComponent } from './components/es-data-table/es-data-table.component';
import { EsGroupedDataTableComponent } from './components/es-grouped-data-table/es-grouped-data-table.component';
import { EsMultiHeaderTableComponent } from './components/es-multi-header-table/es-multi-header-table.component';

import { EsWizardStepComponent } from './components/es-wizard/es-wizard-step/es-wizard-step.component';
import { EsWizardComponent } from './components/es-wizard/es-wizard.component';

import { EsHeaderFilterComponent } from './components/es-header-filter/es-header-filter.component';

import { EsButtonComponent } from './components/es-button/es-button.component';
import { EsDateSelectorComponent } from './components/es-date-selector/es-date-selector.component';
import { EsDropdownContainerComponent } from './components/es-dropdown-container/es-dropdown-container.component';
import { EsDropdownFieldComponent } from './components/es-dropdown-field/es-dropdown-field.component';
import { EsDropdownSearchComponent } from './components/es-dropdown-search/es-dropdown-search.component';
import { EsFieldComponent } from './components/es-field/es-field.component';
import { EsFormFieldComponent } from './components/es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from './components/es-form-fieldset/es-form-fieldset.component';
import { EsGroupedListComponent } from './components/es-grouped-list/es-grouped-list.component';
import { EsLookupComponent } from './components/es-lookup/es-lookup.component';
import { EsMenuComponent } from './components/es-menu/es-menu.component';
import { EsModalComponent } from './components/es-modal/es-modal.component';
import { EsNavigationMenuComponent } from './components/es-navigation-menu/es-navigation-menu.component';
import { EsPagerComponent } from './components/es-pager/es-pager.component';
import { EsValidationMessageComponent } from './components/es-validation-message/es-validation-message.component';
import { EsDrawerComponent } from './components/es-drawer/es-drawer.component';
import { EsLoaderComponent } from './components/es-loader/es-loader.component';
import { EsChartComponent } from './components/es-chart/es-chart.component';
import { EsTagSelectComponent } from './components/es-tag-select/es-tag-select.component';
import { EsTabsComponent } from './components/es-tabs/es-tabs.component';
import { EsTabComponent } from './components/es-tab/es-tab.component';
import { EsImageSliderComponent } from './components/es-image-slider/es-image-slider.component';
// Directives
import { EsDropdownDirective } from './directives/es-dropdown/es-dropdown.directive';
import { EsOnlyNumberDirective } from './directives/es-only-number/es-only-number.directive';
import { EsTooltipDirective } from './directives/es-tooltip/es-tooltip.directive';
import { EsValidationMessageDirective } from './directives/es-validation-message/es-validation-message.directive';
// Pipes
import { NumericPipe } from './pipes/numeric.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { TagFilterPipe } from './pipes/tag-filter.pipe';
// Services
import { CacheService } from './util/cache.service';
import { ExportService } from './util/export/export.service';
import { RedirectionHandlerService } from './services/redirection-handler/redirection-handler.service';
import { StateService } from './services/state/state.service';
// Validators
import { EmailValidator } from './validators/email.validator';
import { EmaticEmailValidator } from './validators/ematic-email.validator';
import { NonEmaticEmailValidator } from './validators/non-ematic-email.validator';
import { EqualValidator } from './validators/equal.validator';
import { PasswordValidator } from './validators/password.validator';
import { EmaticKeyValidator } from './validators/ematic-key.validator';
import { NumberGreaterThenValidator } from './validators/number-greater-then.validator';
import { FieldRequiredValidator } from './validators/field-required.validator';
import { UrlValidator } from './validators/url.validator';

export const FORM_COMPONENTS: any[] = [
  EsCheckboxComponent,
  EsDatePickerComponent,
  EsGroupedListComponent,
  EsLookupComponent,
  EsGroupedListPickerComponent,
  EsMultiSelectComponent,
  EsNumberFieldComponent,
  EsRangePickerComponent,
  EsSelectComponent,
  EsSwitchComponent,
  EsTextFieldComponent,
  EsRadiobuttonComponent,
  EsRangeSliderComponent
];

export const DIRECTIVES: any[] = [
  EsDropdownDirective,
  EsOnlyNumberDirective,
  EsTooltipDirective,
  EsValidationMessageDirective
];

export const VALIDATORS: any[] = [
  EmailValidator,
  EmaticEmailValidator,
  NonEmaticEmailValidator,
  EqualValidator,
  PasswordValidator,
  EmaticKeyValidator,
  NumberGreaterThenValidator,
  FieldRequiredValidator,
  UrlValidator
];

export const ENTRY_COMPONENTS: any[] = [
  EsTooltipComponent
];

export const COMPONENTS: any[] = [
  // Forms
  ...FORM_COMPONENTS,
  // EntryComponents
  ...ENTRY_COMPONENTS,
  // Components
  EsDataTableComponent,
  EsGroupedDataTableComponent,
  EsWizardStepComponent,
  EsWizardComponent,
  EsAccordionComponent,
  EsButtonComponent,
  EsDateSelectorComponent,
  EsDropdownContainerComponent,
  EsDropdownFieldComponent,
  EsDropdownSearchComponent,
  EsFieldComponent,
  EsFormFieldComponent,
  EsFormFieldsetComponent,
  EsMenuComponent,
  EsModalComponent,
  EsDrawerComponent,
  EsPagerComponent,
  EsNavigationMenuComponent,
  EsValidationMessageComponent,
  EsMultiHeaderTableComponent,
  EsLoaderComponent,
  EsChartComponent,
  EsTagSelectComponent,
  EsTabsComponent,
  EsTabComponent,
  EsImageSliderComponent,
  EsHeaderFilterComponent,
  // Directives
  ...DIRECTIVES,
  // Validators
  ...VALIDATORS
];

export const PIPES: any[] = [
  NumericPipe,
  SearchPipe,
  TagFilterPipe
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ChartsModule
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ],
  declarations: [...COMPONENTS, ...PIPES],
  providers: [
    CacheService,
    ExportService,
    RedirectionHandlerService,
    StateService,
    // Pipes
    ...PIPES,
    DecimalPipe,
    PercentPipe,
    CurrencyPipe
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    HttpClientModule,
    ...COMPONENTS,
    ...PIPES
  ]
})
export class EmaticCoreUIModule {
}
