export const translations = {
  en: {
    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    name: "Name",
    email: "Email",
    password: "Password",
    yourName: "Your name",
    yourEmail: "your@email.com",
    minimumCharacters: "Minimum 8 characters",
    creatingAccount: "Creating account...",
    signingIn: "Signing in...",
    forgotPassword: "Forgot password?",
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordDescription: "Enter your email address and we'll send you a link to reset your password.",
    sendResetLink: "Send Reset Link",
    sendingResetLink: "Sending...",
    resetLinkSent: "Reset link sent!",
    resetLinkSentDescription: "Check your email for a link to reset your password.",
    backToSignIn: "Back to Sign In",
    resetPassword: "Reset Password",
    resetPasswordDescription: "Enter your new password below.",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    resetPasswordButton: "Reset Password",
    resettingPassword: "Resetting...",
    passwordResetSuccess: "Password reset successfully!",
    passwordResetSuccessDescription: "You can now sign in with your new password.",
    passwordResetFailed: "Password reset failed",
    passwordResetError: "Could not reset password. The link may have expired.",
    passwordsDoNotMatch: "Passwords do not match",
    invalidResetLink: "Invalid or expired reset link",
    emailNotFound: "Email not found",

    // App
    autoremind: "AutoRemind",
    slogan: "Easy reminders for busy professionals",
    settings: "Settings",
    logout: "Logout",

    // Clients
    clients: "Clients",
    manageReminders: "Manage your reminders",
    searchBy: "Search by name...",
    addClient: "Add Client",
    noClientsYet: "No clients yet",
    addFirstClient: "Add your first client to start managing reminders",
    noResultsFound: "No results found",
    tryDifferentSearch: "Try adjusting your search",

    // Client Table
    client: "Client",
    vehicle: "Vehicle",
    resource: "Resource",
    phone: "Phone",
    maintenance: "Maintenance",
    reminderDate: "Reminder Date",
    actions: "Actions",
    scheduled: "Scheduled",
    sent: "Sent",
    overdue: "Overdue",
    dueSoon: "Due Soon",

    // Dialog
    addNewClient: "Add New Client",
    editClient: "Edit Client",
    enterClientDetails: "Enter client details to schedule  reminders",
    updateClientDetails: "Update client details",
    clientName: "Client Name",
    clientEmail: "Client Email",
    phoneNumber: "Phone Number",
    carModel: "Car Model",
    maintenanceDate: "Maintenance Date",
    cancel: "Cancel",
    saveClient: "Save Client",
    saving: "Saving...",
    updating: "Updating...",
    updateClient: "Update Client",
    nameRequired: "Name is required",
    phoneRequired: "Phone is required",
    carRequired: "Car is required",
    resourceRequired: "Resource is required",
    dateRequired: "Date is required",
    optional: "optional",
    date: "Date",

    // Settings
    settingsTitle: "Settings",
    configureBusinessInfo:
      "Configure your business information and SMS notifications",
    backToDashboard: "Back to Dashboard",
    backToHome: "Back",
    businessInformation: "Business Information",
    businessDetails: "Your business details used in SMS messages",
    businessName: "Business Name",
    businessGarageName: "Business/Garage Name",
    businessNamePlaceholder: "e.g., Auto Service Center",
    businessNameHint:
      "This name will appear in your SMS messages as {business_name}",
    businessContact: "Business Contact",
    businessContactPlaceholder: "e.g., +351912345678 or info@business.com",
    businessContactHint: "Phone, email, or website shown as {business_contact}",
    reminderDaysBefore: "Days Before Reminder",
    reminderDaysBeforeHint:
      "How many days before the date to send the reminder (default: 7)",

    smsTemplate: "SMS Template",
    customizeMessage: "Customize the message sent to your clients",
    messageTemplate: "Message Template",
    availableVariables: "Available Variables:",
    clientNameVar: "Client's name",
    carModelVar: "Car model",
    clientResourceVar: "Client's resource (car, equipment, etc.)",
    reminderDateVar: "Reminder Date",
    businessNameVar: "Your business name",
    businessContactVar: "Your business contact",

    twilioConfiguration: "Twilio Configuration",
    connectTwilioAccount: "Connect your Twilio account to send SMS",
    requirements: "Requirements",
    twilioReq1: "Phone number must be purchased from Twilio",
    twilioReq2: "Trial accounts can only send to verified numbers",
    twilioReq3: "Use E.164 format: +[country][number]",
    accountSid: "Account SID",
    authToken: "Auth Token",
    authTokenEncrypted: "Encrypted in database",
    twilioPhoneNumber: "Phone Number",
    twilioPhoneHint: "Must be a Twilio number in E.164 format",
    usefulLinks: "Useful Links",
    viewBilling: "View Billing & Balance",
    managePhoneNumbers: "Manage Phone Numbers",
    twilioConsole: "Twilio Console",

    testSms: "Test SMS",
    sendTestMessage: "Send a test message to verify your configuration",
    testPhoneNumber: "Test Phone Number",
    testPhoneHint: "Enter a phone number to receive a test SMS",
    sendTestSms: "Send Test SMS",
    sending: "Sending...",

    saveChanges: "Save Changes",

    // Common
    success: "Success!",
    error: "Error",
    send: "Send",
    delete: "Delete",
    deleting: "Deleting...",
    selected: "selected",
    deleteConfirmation: "Are you sure you want to delete this client?",
    loading: "Loading...",
    unauthorized: "Unauthorized",

    // Account Management
    account: "Account",
    accountManagement: "Account Management",
    manageAccountDescription: "Manage your profile and account settings",
    profileInformation: "Profile Information",
    updateProfileDescription: "Update your name",
    namePlaceholder: "Your name",
    emailPlaceholder: "your@email.com",
    emailChangeNotSupported: "Email changes are not supported at this time",
    dangerZone: "Danger Zone",
    dangerZoneDescription: "Irreversible and destructive actions",
    deleteAccount: "Delete Account",
    deleteAccountWarning:
      "Permanently delete your account and all associated data. This action cannot be undone.",
    deleteAccountConfirmTitle: "Are you absolutely sure?",
    deleteAccountConfirmMessage:
      "This will permanently delete your account and all associated data. This action is irreversible.",
    deleteAccountItem1: "All your clients and reminders will be deleted",
    deleteAccountItem2: "Your subscription will be cancelled",
    deleteAccountItem3: "All your settings will be lost",
    deleteAccountItem4: "Your account cannot be recovered",
    deleteAccountWarningFinal:
      "This action cannot be undone. Please be certain.",
    typeToConfirm: 'Type "{text}" to confirm',
    deleteAccountPermanently: "Delete Account Permanently",
    profileUpdatedSuccess: "Profile updated successfully!",
    profileUpdateError: "Error updating profile",
    accountDeletedSuccess: "Account deleted successfully",
    accountDeleteError: "Error deleting account",
    emailAlreadyExists: "This email is already in use",

    // Client Deletion
    deleteClientConfirmTitle: "Delete this client?",
    deleteClientConfirmMessage:
      'Are you sure you want to delete "{clientName}"? This action cannot be undone.',
    deleteClientItem1: "All reminder history for this client will be deleted",
    deleteClientItem2: "This client will be permanently removed from your list",
    deleteClientWarningFinal: "This action cannot be undone.",
    deleteClientPermanently: "Delete Client Permanently",

    // Bulk Client Deletion
    bulkDeleteConfirmTitle: "Delete {count} clients?",
    bulkDeleteConfirmMessage:
      "Are you sure you want to delete {count} clients? This action cannot be undone.",
    bulkDeleteItem1:
      "All selected clients and their reminder history will be deleted",
    bulkDeleteItem2: "These clients will be permanently removed from your list",
    bulkDeleteWarningFinal: "This action cannot be undone.",
    bulkDeletePermanently: "Delete Clients Permanently",

    // Toast Messages
    errorGeneric: "An error occurred. Please try again.",
    allFieldsRequired: "All fields are required",
    clientAddedSuccess: "Client added successfully!",
    clientAddError: "Error adding client",
    clientUpdatedSuccess: "Client updated successfully!",
    clientUpdateError: "Error updating client",
    clientNotFound: "Client not found",
    clientDeletedSuccess: "Client deleted successfully!",
    clientDeleteError: "Error deleting client",
    settingsSavedSuccess: "Settings saved successfully!",
    settingsSaveError: "Error saving settings",
    atLeastOneField: "At least one field must be provided",
    testSmsSentSuccess: "Test SMS sent successfully!",
    smsError: "Error sending SMS",
    testSmsError: "Error sending test SMS",
    reminderSentSuccess: "Reminder sent successfully!",
    reminderSendError: "Error sending reminder",
    signedInSuccess: "Signed in successfully.",
    signInFailed: "Sign in failed",
    invalidCredentials: "Invalid email or password.",
    accountCreatedSuccess: "Account created successfully.",
    signUpFailed: "Sign up failed",
    emailInUse: "Email already in use or an error occurred.",

    // Tabs
    business: "Business",
    template: "SMS Template",
    twilioConfig: "SMS Provider",
    test: "Test SMS",

    // Pagination
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    page: "Page",

    // Import/Export
    importClients: "Import Clients",
    exportClients: "Export Clients",
    importExcel: "Import Excel",
    exportExcel: "Export Excel",
    importFromExcel: "Import clients from an Excel file",
    exportToExcel: "Export clients to an Excel file",
    chooseFile: "Choose File",
    importing: "Importing...",
    exporting: "Exporting...",
    errorImportingClients: "Error importing clients.",
    errorReadingFile: "Error reading file.",
    errorExportingClients: "Error exporting clients.",
    clientsImportedSuccess: "clients imported successfully!",
    noValidRows: "No valid rows found in the file. Please check the format.",
    excelFormatRequired: "Excel format required",
    excelFormatDescription:
      "Name, Email (optional), Phone, Resource, Date (DD/MM/YYYY)",
    excelColumnFlexible: "Column names are flexible (Portuguese or English)",
    excelPhoneFormat:
      "Format phone column as Text to preserve leading zeros (e.g., 0612345678)",
    viewExample: "View example",
    hideExample: "Hide example",

    // Billing & Subscription
    billing: "Billing",
    manageBillingDescription: "Manage your subscription and billing",
    allPlans: "All Plans",
    upgradeYourPlan: "Upgrade Your Plan",
    bestPlanDescription:
      "You're on the best plan. Manage your subscription on the left.",
    choosePlanDescription: "Choose the plan that fits your needs",
    subscription: "Subscription",
    currentPlan: "Current Plan",
    upgradePlan: "Upgrade Plan",
    manageBilling: "Manage Billing",
    price: "Price",
    perMonth: "/month",
    renewsOn: "Renews on",
    expiresOn: "Expires on",
    active: "Active",
    pastDue: "Past Due",
    canceledAtPeriodEnd: "Canceled",

    // Plans
    plan: "Plan",
    planFree: "Free",
    planStarter: "Starter",
    planPro: "Pro",

    // Features
    featureImportExport: "Excel Import/Export",
    feature50Clients: "Up to 50 clients",
    feature100Clients: "Up to 100 clients",
    featureUnlimitedClients: "Unlimited clients",
    featureOwnTwilio: "Use your own Twilio account",
    featureManagedSms: "Managed SMS (included)",
    featureBasicSupport: "Basic support",
    featurePrioritySupport: "Priority support",
    featurePremiumSupport: "Premium support",
    featureAdvancedTemplates: "Advanced templates",
    featureCustomBranding: "Custom branding",
    ownTwilio: "Own Twilio",
    managedSms: "Managed SMS",
    unlimitedClients: "Unlimited clients",
    managedSmsDescription:
      "Let us handle SMS delivery for you - no Twilio account needed",
    managedSmsActiveDescription:
      "We're handling SMS delivery for you. Toggle off to use your own Twilio account.",
    managedSmsEnabled: "Managed SMS is Active",
    managedSmsEnabledDescription:
      "We're handling SMS delivery for you. Your messages will be sent using our reliable infrastructure.",
    noTwilioAccountNeeded: "No Twilio account needed",
    autoConfiguration: "Automatic configuration",
    reliableDelivery: "Reliable message delivery",

    // Usage Stats
    usageStats: "Usage Statistics",
    clientUsageTracking: "Track your client usage",
    clientsUsed: "clients used",
    clientsUsedOf: "of {total} clients",
    used: "used",
    clientsRemaining: "{remaining} clients remaining",
    approachingLimit: "Approaching your limit",
    considerUpgrading: "Consider upgrading to add more clients",
    viewPlans: "View Plans",

    // Errors & Messages
    clientLimitReached: "Client limit reached",
    upgradeToAddMoreClients: "Upgrade your plan to add more clients",
    checkoutError: "Failed to create checkout session",
    portalError: "Failed to open billing portal",
    paymentFailedMessage:
      "Your payment failed. Please update your payment method to continue using premium features.",
    subscriptionCanceledMessage:
      "Your subscription will be canceled at the end of the billing period. You can reactivate it anytime.",
    subscriptionUpdated: "Your subscription has been updated successfully!",
    checkoutCanceled: "Checkout was canceled. You can try again anytime.",
    contactSales: "Contact Sales",
    upgradeToPlan: "Upgrade to {plan}",
    smsHandling: "SMS Handling",
    canceled: "Canceled",

    // Plan Change Dialog
    confirmUpgrade: "Confirm Upgrade",
    confirmDowngrade: "Confirm Downgrade",
    newPlan: "New Plan",
    whatHappensNext: "What happens next?",
    proratedChargeExplanation:
      "You'll be charged a prorated amount for the plan difference",
    immediateAccessExplanation:
      "You'll get immediate access to all new features",
    nextBillingExplanation: "Your next billing cycle will be at the new price",
    nextBillingLowerPriceExplanation:
      "Your next billing cycle will be at the lower price",
    paymentRequired: "Payment of {price} required",
    monthlyBillingExplanation: "You'll be billed monthly",
    annualBillingExplanation: "You'll be billed annually",
    downgradeCreditExplanation:
      "You'll receive a prorated credit for the difference",
    downgradeFreePortalExplanation:
      "Use the billing portal to cancel your subscription",
    downgradeTakesEffectExplanation:
      "Changes take effect at the end of your billing period",
    invalidPriceId: "Invalid price ID",
    newPrice: "New price",
    processing: "Processing...",
    openBillingPortal: "Open Billing Portal",
    confirm: "Confirm",
    downgradePlan: "Downgrade",
    notAvailable: "Not Available",

    // Landing Page
    landingHeadline: "Never miss a follow-up",
    landingSubheadline: "Automated SMS reminders for your clients.",
    getStarted: "Get Started",
    privacy: "Privacy",
    terms: "Terms",
    copyright: "© 2025 AutoRemind",
    howItWorks: "How it works",
    step1Title: "Import your clients",
    step1Description:
      "Upload your client database from Excel with their information and reminder dates",
    step2Title: "Configure your business",
    step2Description:
      "Set up your business information and customize your SMS template",
    step3Title: "Automatic reminders",
    step3Description:
      "Your clients will automatically receive SMS reminders before their appointments",

    // Pricing
    pricingTitle: "Simple pricing",
    pricingSubtitle:
      "Start free with your own Twilio, or let us handle SMS for you",
    popular: "Popular",
    planFreeDescription: "Use your own Twilio account",
    planFreeFeature1: "Up to 50 clients",
    planFreeFeature2: "Use your own Twilio keys",
    planFreeFeature3: "Excel Import/Export",
    planFreeFeature4: "Basic support",
    planStarterDescription: "We handle the SMS for you",
    planStarterFeature1: "Up to 100 clients",
    planStarterFeature2: "Managed SMS (included)",
    planStarterFeature3: "Excel Import/Export",
    planStarterFeature4: "Priority support",
    planProDescription: "For growing businesses",
    planProFeature1: "Unlimited clients",
    planProFeature2: "Managed SMS (included)",
    planProFeature3: "Excel Import/Export",
    planProFeature4: "Premium support",
    readyToStart: "Ready to get started?",
    readyToStartSubtitle: "Start sending automated SMS reminders today",
    getStartedFree: "Get Started - It's Free",

    // Billing Interval
    monthly: "Monthly",
    annual: "Annual",
    perYear: "/year",
    billedAnnually: "Billed annually",
    billedMonthly: "Billed monthly",
    switchToAnnual: "Switch to Annual",
    switchToMonthly: "Switch to Monthly",

    // Hero Visual
    upcomingReminders: "Upcoming Reminders",
    today: "Today",
    heroClient1Name: "Sarah Johnson",
    heroClient1Service: "Dental checkup • Dec 15",
    heroClient2Name: "James Wilson",
    heroClient2Service: "Haircut appointment • Dec 12",
    heroClient3Name: "Emily Davis",
    heroClient3Service: "Car service • Dec 10",
    heroClient4Name: "Michael Brown",
    heroClient4Service: "Gym session • Dec 18",
  },
  pt: {
    // Auth
    signIn: "Entrar",
    signUp: "Registar",
    createAccount: "Criar Conta",
    alreadyHaveAccount: "Já tem uma conta?",
    dontHaveAccount: "Não tem uma conta?",
    name: "Nome",
    email: "Email",
    password: "Palavra-passe",
    yourName: "O seu nome",
    yourEmail: "seu@email.com",
    minimumCharacters: "Mínimo 8 caracteres",
    creatingAccount: "A criar conta...",
    signingIn: "A entrar...",
    forgotPassword: "Esqueceu a palavra-passe?",
    forgotPasswordTitle: "Recuperar Palavra-passe",
    forgotPasswordDescription: "Introduza o seu email e enviaremos um link para redefinir a sua palavra-passe.",
    sendResetLink: "Enviar Link",
    sendingResetLink: "A enviar...",
    resetLinkSent: "Link enviado!",
    resetLinkSentDescription: "Verifique o seu email para um link de redefinição de palavra-passe.",
    backToSignIn: "Voltar ao Login",
    resetPassword: "Redefinir Palavra-passe",
    resetPasswordDescription: "Introduza a sua nova palavra-passe abaixo.",
    newPassword: "Nova Palavra-passe",
    confirmPassword: "Confirmar Palavra-passe",
    resetPasswordButton: "Redefinir Palavra-passe",
    resettingPassword: "A redefinir...",
    passwordResetSuccess: "Palavra-passe redefinida com sucesso!",
    passwordResetSuccessDescription: "Pode agora iniciar sessão com a sua nova palavra-passe.",
    passwordResetFailed: "Falha ao redefinir palavra-passe",
    passwordResetError: "Não foi possível redefinir a palavra-passe. O link pode ter expirado.",
    passwordsDoNotMatch: "As palavras-passe não coincidem",
    invalidResetLink: "Link inválido ou expirado",
    emailNotFound: "Email não encontrado",

    // App
    autoremind: "AutoRemind",
    slogan: "Lembretes fáceis para profissionais ocupados",
    settings: "Configurações",
    logout: "Sair",

    // Clients
    clients: "Clientes",
    manageReminders: "Gerir os seus lembretes",
    searchBy: "Pesquisar por nome...",
    addClient: "Adicionar Cliente",
    noClientsYet: "Ainda não tem clientes",
    addFirstClient:
      "Adicione o seu primeiro cliente para começar a gerir lembretes",
    noResultsFound: "Nenhum resultado encontrado",
    tryDifferentSearch: "Tente ajustar a sua pesquisa",

    // Client Table
    client: "Cliente",
    vehicle: "Viatura",
    resource: "Recurso",
    phone: "Telemóvel",
    maintenance: "Manutenção",
    reminderDate: "Data do Lembrete",
    actions: "Ações",
    scheduled: "Agendado",
    sent: "Enviado",
    overdue: "Atrasado",
    dueSoon: "Em Breve",

    // Dialog
    addNewClient: "Adicionar Novo Cliente",
    editClient: "Editar Cliente",
    enterClientDetails:
      "Introduza os detalhes do cliente para agendar lembretes",
    updateClientDetails: "Atualizar detalhes do cliente",
    clientName: "Nome do Cliente",
    clientEmail: "Email do Cliente",
    phoneNumber: "Número de Telemóvel",
    carModel: "Modelo do Carro",
    maintenanceDate: "Data de Manutenção",
    cancel: "Cancelar",
    saveClient: "Guardar Cliente",
    saving: "A guardar...",
    updating: "A atualizar...",
    updateClient: "Atualizar Cliente",
    nameRequired: "Nome é obrigatório",
    phoneRequired: "Telemóvel é obrigatório",
    carRequired: "Carro é obrigatório",
    resourceRequired: "Recurso é obrigatório",
    dateRequired: "Data é obrigatória",
    optional: "opcional",
    date: "Data",

    // Settings
    settingsTitle: "Configurações",
    configureBusinessInfo:
      "Configure as informações do seu negócio e notificações SMS",
    backToDashboard: "Voltar ao Painel",
    backToHome: "Voltar",
    businessInformation: "Informações do Negócio",
    businessDetails: "Detalhes do seu negócio usados nas mensagens SMS",
    businessName: "Nome do Negócio",
    businessGarageName: "Nome do Negócio/Oficina",
    businessNamePlaceholder: "ex., Centro de Serviço Auto",
    businessNameHint:
      "Este nome aparecerá nas suas mensagens SMS como {business_name}",
    businessContact: "Contacto do Negócio",
    businessContactPlaceholder: "ex., +351912345678 ou info@negocio.com",
    businessContactHint:
      "Telefone, email ou website mostrado como {business_contact}",
    reminderDaysBefore: "Dias Antes do Lembrete",
    reminderDaysBeforeHint:
      "Quantos dias antes da data para enviar o lembrete (padrão: 7)",

    smsTemplate: "Modelo de SMS",
    customizeMessage: "Personalize a mensagem enviada aos seus clientes",
    messageTemplate: "Modelo de Mensagem",
    availableVariables: "Variáveis Disponíveis:",
    clientNameVar: "Nome do cliente",
    carModelVar: "Modelo do carro",
    clientResourceVar: "Recurso do cliente (carro, equipamento, etc.)",
    reminderDateVar: "Data do lembrete",
    businessNameVar: "Nome do seu negócio",
    businessContactVar: "Contacto do seu negócio",

    twilioConfiguration: "Configuração Twilio",
    connectTwilioAccount: "Conecte a sua conta Twilio para enviar SMS",
    requirements: "Requisitos",
    twilioReq1: "O número de telefone deve ser comprado da Twilio",
    twilioReq2: "Contas de teste só podem enviar para números verificados",
    twilioReq3: "Use o formato E.164: +[país][número]",
    accountSid: "Account SID",
    authToken: "Auth Token",
    authTokenEncrypted: "Encriptado na base de dados",
    twilioPhoneNumber: "Número de Telefone",
    twilioPhoneHint: "Deve ser um número Twilio no formato E.164",
    usefulLinks: "Links Úteis",
    viewBilling: "Ver Faturação e Saldo",
    managePhoneNumbers: "Gerir Números de Telefone",
    twilioConsole: "Consola Twilio",

    testSms: "Testar SMS",
    sendTestMessage:
      "Envie uma mensagem de teste para verificar a sua configuração",
    testPhoneNumber: "Número de Telefone de Teste",
    testPhoneHint:
      "Introduza um número de telefone para receber um SMS de teste",
    sendTestSms: "Enviar SMS de Teste",
    sending: "A enviar...",

    saveChanges: "Guardar Alterações",

    // Common
    success: "Sucesso!",
    error: "Erro",
    send: "Enviar",
    delete: "Eliminar",
    deleting: "A eliminar...",
    selected: "selecionado(s)",
    deleteConfirmation: "Tem a certeza que deseja eliminar este cliente?",
    loading: "A carregar...",
    unauthorized: "Não autorizado",

    // Account Management
    account: "Conta",
    accountManagement: "Gestão de Conta",
    manageAccountDescription: "Gerir o seu perfil e configurações de conta",
    profileInformation: "Informação de Perfil",
    updateProfileDescription: "Atualize o seu nome",
    namePlaceholder: "O seu nome",
    emailPlaceholder: "oseu@email.com",
    emailChangeNotSupported:
      "Alterações de email não são suportadas neste momento",
    dangerZone: "Zona de Perigo",
    dangerZoneDescription: "Ações irreversíveis e destrutivas",
    deleteAccount: "Eliminar Conta",
    deleteAccountWarning:
      "Eliminar permanentemente a sua conta e todos os dados associados. Esta ação não pode ser desfeita.",
    deleteAccountConfirmTitle: "Tem absoluta certeza?",
    deleteAccountConfirmMessage:
      "Isto irá eliminar permanentemente a sua conta e todos os dados associados. Esta ação é irreversível.",
    deleteAccountItem1: "Todos os seus clientes e lembretes serão eliminados",
    deleteAccountItem2: "A sua subscrição será cancelada",
    deleteAccountItem3: "Todas as suas configurações serão perdidas",
    deleteAccountItem4: "A sua conta não pode ser recuperada",
    deleteAccountWarningFinal:
      "Esta ação não pode ser desfeita. Por favor, tenha certeza.",
    typeToConfirm: 'Digite "{text}" para confirmar',
    deleteAccountPermanently: "Eliminar Conta Permanentemente",
    profileUpdatedSuccess: "Perfil atualizado com sucesso!",
    profileUpdateError: "Erro ao atualizar perfil",
    accountDeletedSuccess: "Conta eliminada com sucesso",
    accountDeleteError: "Erro ao eliminar conta",
    emailAlreadyExists: "Este email já está em uso",

    // Client Deletion
    deleteClientConfirmTitle: "Eliminar este cliente?",
    deleteClientConfirmMessage:
      'Tem a certeza que deseja eliminar "{clientName}"? Esta ação não pode ser desfeita.',
    deleteClientItem1:
      "Todo o histórico de lembretes deste cliente será eliminado",
    deleteClientItem2:
      "Este cliente será removido permanentemente da sua lista",
    deleteClientWarningFinal: "Esta ação não pode ser desfeita.",
    deleteClientPermanently: "Eliminar Cliente Permanentemente",

    // Bulk Client Deletion
    bulkDeleteConfirmTitle: "Eliminar {count} clientes?",
    bulkDeleteConfirmMessage:
      "Tem a certeza que deseja eliminar {count} clientes? Esta ação não pode ser desfeita.",
    bulkDeleteItem1:
      "Todos os clientes selecionados e o seu histórico de lembretes serão eliminados",
    bulkDeleteItem2:
      "Estes clientes serão removidos permanentemente da sua lista",
    bulkDeleteWarningFinal: "Esta ação não pode ser desfeita.",
    bulkDeletePermanently: "Eliminar Clientes Permanentemente",

    // Toast Messages
    errorGeneric: "Ocorreu um erro. Por favor, tente novamente.",
    allFieldsRequired: "Todos os campos são obrigatórios",
    clientAddedSuccess: "Cliente adicionado com sucesso!",
    clientAddError: "Erro ao adicionar cliente",
    clientUpdatedSuccess: "Cliente atualizado com sucesso!",
    clientUpdateError: "Erro ao atualizar cliente",
    clientNotFound: "Cliente não encontrado",
    clientDeletedSuccess: "Cliente eliminado com sucesso!",
    clientDeleteError: "Erro ao eliminar cliente",
    settingsSavedSuccess: "Configurações guardadas com sucesso!",
    settingsSaveError: "Erro ao guardar configurações",
    atLeastOneField: "Pelo menos um campo deve ser fornecido",
    testSmsSentSuccess: "SMS de teste enviado com sucesso!",
    smsError: "Erro ao enviar SMS",
    testSmsError: "Erro ao enviar SMS de teste",
    reminderSentSuccess: "Lembrete enviado com sucesso!",
    reminderSendError: "Erro ao enviar lembrete",
    signedInSuccess: "Sessão iniciada com sucesso.",
    signInFailed: "Falha ao iniciar sessão",
    invalidCredentials: "Email ou palavra-passe inválidos.",
    accountCreatedSuccess: "Conta criada com sucesso.",
    signUpFailed: "Falha ao criar conta",
    emailInUse: "Email já em uso ou ocorreu um erro.",

    // Tabs
    business: "Negócio",
    template: "Modelo de SMS",
    twilioConfig: "Provedor SMS",
    test: "Testar SMS",

    // Pagination
    showing: "A mostrar",
    to: "a",
    of: "de",
    results: "resultados",
    page: "Página",

    // Import/Export
    importClients: "Importar Clientes",
    exportClients: "Exportar Clientes",
    importExcel: "Importar Excel",
    exportExcel: "Exportar Excel",
    importFromExcel: "Importar clientes de um ficheiro Excel",
    exportToExcel: "Exportar clientes para um ficheiro Excel",
    chooseFile: "Escolher Ficheiro",
    importing: "A importar...",
    exporting: "A exportar...",
    errorImportingClients: "Erro ao importar clientes.",
    errorReadingFile: "Erro ao ler o ficheiro.",
    errorExportingClients: "Erro ao exportar clientes.",
    clientsImportedSuccess: "clientes importados com sucesso!",
    noValidRows:
      "Nenhuma linha válida encontrada no ficheiro. Verifique o formato.",
    excelFormatRequired: "Formato Excel necessário",
    excelFormatDescription:
      "Name, Email (optional), Phone, Resource, Date (DD/MM/YYYY)",
    excelColumnFlexible:
      "Nomes das colunas são flexíveis (Português ou Inglês)",
    excelPhoneFormat:
      "Formate a coluna de telefone como Texto para preservar zeros à esquerda (ex: 0612345678)",
    viewExample: "Ver exemplo",
    hideExample: "Ocultar exemplo",

    // Billing & Subscription
    billing: "Faturação",
    manageBillingDescription: "Gerir a sua subscrição e faturação",
    allPlans: "Todos os Planos",
    upgradeYourPlan: "Fazer Upgrade do Plano",
    bestPlanDescription:
      "Está no melhor plano. Gira a sua subscrição à esquerda.",
    choosePlanDescription: "Escolha o plano que se adequa às suas necessidades",
    subscription: "Subscrição",
    currentPlan: "Plano Atual",
    upgradePlan: "Fazer Upgrade",
    manageBilling: "Gerir Faturação",
    price: "Preço",
    perMonth: "/mês",
    renewsOn: "Renova em",
    expiresOn: "Expira em",
    active: "Ativo",
    pastDue: "Pagamento Atrasado",
    canceledAtPeriodEnd: "Cancelado",

    // Plans
    plan: "Plano",
    planFree: "Grátis",
    planStarter: "Starter",
    planPro: "Pro",

    // Features
    featureImportExport: "Importação/Exportação Excel",
    feature50Clients: "Até 50 clientes",
    feature100Clients: "Até 100 clientes",
    featureUnlimitedClients: "Clientes ilimitados",
    featureOwnTwilio: "Use a sua própria conta Twilio",
    featureManagedSms: "SMS gerido (incluído)",
    featureBasicSupport: "Suporte básico",
    featurePrioritySupport: "Suporte prioritário",
    featurePremiumSupport: "Suporte premium",
    featureAdvancedTemplates: "Modelos avançados",
    featureCustomBranding: "Marca personalizada",
    ownTwilio: "Twilio Próprio",
    managedSms: "SMS Gerido",
    unlimitedClients: "Clientes ilimitados",
    managedSmsDescription:
      "Deixe-nos lidar com o envio de SMS por si - não precisa de conta Twilio",
    managedSmsActiveDescription:
      "Estamos a lidar com o envio de SMS por si. Desative para usar a sua própria conta Twilio.",
    managedSmsEnabled: "SMS Gerido Ativo",
    managedSmsEnabledDescription:
      "Estamos a lidar com o envio de SMS por si. As suas mensagens serão enviadas usando a nossa infraestrutura confiável.",
    noTwilioAccountNeeded: "Não precisa de conta Twilio",
    autoConfiguration: "Configuração automática",
    reliableDelivery: "Entrega confiável de mensagens",

    // Usage Stats
    usageStats: "Estatísticas de Uso",
    clientUsageTracking: "Acompanhe o uso de clientes",
    clientsUsed: "clientes usados",
    clientsUsedOf: "de {total} clientes",
    used: "usado",
    clientsRemaining: "{remaining} clientes restantes",
    approachingLimit: "A aproximar-se do limite",
    considerUpgrading: "Considere fazer upgrade para adicionar mais clientes",
    viewPlans: "Ver Planos",

    // Errors & Messages
    clientLimitReached: "Limite de clientes atingido",
    upgradeToAddMoreClients:
      "Faça upgrade do seu plano para adicionar mais clientes",
    checkoutError: "Erro ao criar sessão de pagamento",
    portalError: "Erro ao abrir portal de faturação",
    paymentFailedMessage:
      "O seu pagamento falhou. Por favor atualize o método de pagamento para continuar a usar funcionalidades premium.",
    subscriptionCanceledMessage:
      "A sua subscrição será cancelada no final do período de faturação. Pode reativá-la a qualquer momento.",
    subscriptionUpdated: "A sua subscrição foi atualizada com sucesso!",
    checkoutCanceled:
      "O pagamento foi cancelado. Pode tentar novamente a qualquer momento.",
    contactSales: "Contactar Vendas",
    upgradeToPlan: "Upgrade para {plan}",
    smsHandling: "Gestão de SMS",
    canceled: "Cancelado",

    // Plan Change Dialog
    confirmUpgrade: "Confirmar Upgrade",
    confirmDowngrade: "Confirmar Downgrade",
    newPlan: "Novo Plano",
    whatHappensNext: "O que acontece a seguir?",
    proratedChargeExplanation:
      "Será cobrado um valor proporcional pela diferença do plano",
    immediateAccessExplanation:
      "Terá acesso imediato a todas as novas funcionalidades",
    nextBillingExplanation: "O próximo ciclo de faturação será ao novo preço",
    nextBillingLowerPriceExplanation:
      "O próximo ciclo de faturação será ao preço mais baixo",
    paymentRequired: "Pagamento de {price} necessário",
    monthlyBillingExplanation: "Será faturado mensalmente",
    annualBillingExplanation: "Será faturado anualmente",
    downgradeCreditExplanation:
      "Receberá um crédito proporcional pela diferença",
    downgradeFreePortalExplanation:
      "Use o portal de faturação para cancelar a sua subscrição",
    downgradeTakesEffectExplanation:
      "As alterações entram em vigor no final do período de faturação",
    invalidPriceId: "ID de preço inválido",
    newPrice: "Novo preço",
    processing: "A processar...",
    openBillingPortal: "Abrir Portal de Faturação",
    confirm: "Confirmar",
    downgradePlan: "Downgrade",
    notAvailable: "Não Disponível",

    // Landing Page
    landingHeadline: "Nunca perca um lembrete",
    landingSubheadline: "Lembretes SMS automáticos para os seus clientes",
    getStarted: "Começar",
    privacy: "Privacidade",
    terms: "Termos",
    copyright: "© 2025 AutoRemind",
    howItWorks: "Como funciona",
    step1Title: "Importe os seus clientes",
    step1Description:
      "Carregue a sua base de dados de clientes do Excel com as suas informações e datas de lembrete",
    step2Title: "Configure o seu negócio",
    step2Description:
      "Defina as informações do seu negócio e personalize o seu modelo de SMS",
    step3Title: "Lembretes automáticos",
    step3Description:
      "Os seus clientes receberão automaticamente lembretes SMS antes das suas marcações",

    // Pricing
    pricingTitle: "Preços simples",
    pricingSubtitle:
      "Comece grátis com o seu Twilio, ou deixe-nos tratar dos SMS",
    popular: "Popular",
    planFreeDescription: "Use a sua própria conta Twilio",
    planFreeFeature1: "Até 50 clientes",
    planFreeFeature2: "Use as suas chaves Twilio",
    planFreeFeature3: "Importar/Exportar Excel",
    planFreeFeature4: "Suporte básico",
    planStarterDescription: "Nós tratamos dos SMS por si",
    planStarterFeature1: "Até 100 clientes",
    planStarterFeature2: "SMS geridos (incluído)",
    planStarterFeature3: "Importar/Exportar Excel",
    planStarterFeature4: "Suporte prioritário",
    planProDescription: "Para negócios em crescimento",
    planProFeature1: "Clientes ilimitados",
    planProFeature2: "SMS geridos (incluído)",
    planProFeature3: "Importar/Exportar Excel",
    planProFeature4: "Suporte premium",
    readyToStart: "Pronto para começar?",
    readyToStartSubtitle: "Comece a enviar lembretes SMS automáticos hoje",
    getStartedFree: "Começar - É Grátis",

    // Billing Interval
    monthly: "Mensal",
    annual: "Anual",
    perYear: "/ano",
    billedAnnually: "Faturado anualmente",
    billedMonthly: "Faturado mensalmente",
    switchToAnnual: "Mudar para Anual",
    switchToMonthly: "Mudar para Mensal",

    // Hero Visual
    upcomingReminders: "Próximos Lembretes",
    today: "Hoje",
    heroClient1Name: "Maria Santos",
    heroClient1Service: "Consulta dentária • 15 Dez",
    heroClient2Name: "João Duarte",
    heroClient2Service: "Corte de cabelo • 12 Dez",
    heroClient3Name: "Ana Lopes",
    heroClient3Service: "Revisão do carro • 10 Dez",
    heroClient4Name: "Pedro Costa",
    heroClient4Service: "Treino ginásio • 18 Dez",
  },
  fr: {
    // Auth
    signIn: "Se connecter",
    signUp: "S'inscrire",
    createAccount: "Créer un compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    name: "Nom",
    email: "Email",
    password: "Mot de passe",
    yourName: "Votre nom",
    yourEmail: "votre@email.com",
    minimumCharacters: "Minimum 8 caractères",
    creatingAccount: "Création du compte...",
    signingIn: "Connexion...",
    forgotPassword: "Mot de passe oublié ?",
    forgotPasswordTitle: "Mot de passe oublié",
    forgotPasswordDescription: "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    sendResetLink: "Envoyer le lien",
    sendingResetLink: "Envoi...",
    resetLinkSent: "Lien envoyé !",
    resetLinkSentDescription: "Vérifiez votre email pour un lien de réinitialisation de mot de passe.",
    backToSignIn: "Retour à la connexion",
    resetPassword: "Réinitialiser le mot de passe",
    resetPasswordDescription: "Entrez votre nouveau mot de passe ci-dessous.",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    resetPasswordButton: "Réinitialiser le mot de passe",
    resettingPassword: "Réinitialisation...",
    passwordResetSuccess: "Mot de passe réinitialisé avec succès !",
    passwordResetSuccessDescription: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
    passwordResetFailed: "Échec de la réinitialisation",
    passwordResetError: "Impossible de réinitialiser le mot de passe. Le lien a peut-être expiré.",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    invalidResetLink: "Lien invalide ou expiré",
    emailNotFound: "Email non trouvé",

    // App
    autoremind: "AutoRemind",
    slogan: "Rappels simples pour pros occupés",
    settings: "Paramètres",
    logout: "Déconnexion",

    // Clients
    clients: "Clients",
    manageReminders: "Gérer vos rappels",
    searchBy: "Rechercher par nom...",
    addClient: "Ajouter un client",
    noClientsYet: "Pas encore de clients",
    addFirstClient:
      "Ajoutez votre premier client pour commencer à gérer les rappels",
    noResultsFound: "Aucun résultat trouvé",
    tryDifferentSearch: "Essayez d'ajuster votre recherche",

    // Client Table
    client: "Client",
    vehicle: "Véhicule",
    resource: "Ressource",
    phone: "Téléphone",
    maintenance: "Maintenance",
    reminderDate: "Date du rappel",
    actions: "Actions",
    scheduled: "Programmé",
    sent: "Envoyé",
    overdue: "En retard",
    dueSoon: "Bientôt dû",

    // Dialog
    addNewClient: "Ajouter un nouveau client",
    editClient: "Modifier le client",
    enterClientDetails:
      "Entrez les détails du client pour programmer les rappels",
    updateClientDetails: "Mettre à jour les détails du client",
    clientName: "Nom du client",
    clientEmail: "Email du client",
    phoneNumber: "Numéro de téléphone",
    carModel: "Modèle de voiture",
    maintenanceDate: "Date de maintenance",
    cancel: "Annuler",
    saveClient: "Enregistrer le client",
    saving: "Enregistrement...",
    updating: "Mise à jour...",
    updateClient: "Mettre à jour le client",
    nameRequired: "Le nom est obligatoire",
    phoneRequired: "Le téléphone est obligatoire",
    carRequired: "La voiture est obligatoire",
    resourceRequired: "La ressource est obligatoire",
    dateRequired: "La date est obligatoire",
    optional: "optionnel",
    date: "Date",

    // Settings
    settingsTitle: "Paramètres",
    configureBusinessInfo:
      "Configurez les informations de votre entreprise et les notifications SMS",
    backToDashboard: "Retour au tableau de bord",
    backToHome: "Retour",
    businessInformation: "Informations sur l'entreprise",
    businessDetails:
      "Les détails de votre entreprise utilisés dans les messages SMS",
    businessName: "Nom de l'entreprise",
    businessGarageName: "Nom de l'entreprise/Garage",
    businessNamePlaceholder: "ex., Centre de service automobile",
    businessNameHint:
      "Ce nom apparaîtra dans vos messages SMS comme {business_name}",
    businessContact: "Contact de l'entreprise",
    businessContactPlaceholder: "ex., +33612345678 ou info@entreprise.com",
    businessContactHint:
      "Téléphone, email ou site web affiché comme {business_contact}",
    reminderDaysBefore: "Jours avant le rappel",
    reminderDaysBeforeHint:
      "Combien de jours avant la date pour envoyer le rappel (par défaut : 7)",

    smsTemplate: "Modèle de SMS",
    customizeMessage: "Personnalisez le message envoyé à vos clients",
    messageTemplate: "Modèle de message",
    availableVariables: "Variables disponibles :",
    clientNameVar: "Nom du client",
    carModelVar: "Modèle de voiture",
    clientResourceVar: "Ressource du client (voiture, équipement, etc.)",
    reminderDateVar: "Date du rappel",
    businessNameVar: "Nom de votre entreprise",
    businessContactVar: "Contact de votre entreprise",

    twilioConfiguration: "Configuration Twilio",
    connectTwilioAccount: "Connectez votre compte Twilio pour envoyer des SMS",
    requirements: "Exigences",
    twilioReq1: "Le numéro de téléphone doit être acheté auprès de Twilio",
    twilioReq2:
      "Les comptes d'essai ne peuvent envoyer qu'aux numéros vérifiés",
    twilioReq3: "Utilisez le format E.164 : +[pays][numéro]",
    accountSid: "Account SID",
    authToken: "Auth Token",
    authTokenEncrypted: "Chiffré dans la base de données",
    twilioPhoneNumber: "Numéro de téléphone",
    twilioPhoneHint: "Doit être un numéro Twilio au format E.164",
    usefulLinks: "Liens utiles",
    viewBilling: "Voir la facturation et le solde",
    managePhoneNumbers: "Gérer les numéros de téléphone",
    twilioConsole: "Console Twilio",

    testSms: "Test SMS",
    sendTestMessage:
      "Envoyez un message de test pour vérifier votre configuration",
    testPhoneNumber: "Numéro de téléphone de test",
    testPhoneHint: "Entrez un numéro de téléphone pour recevoir un SMS de test",
    sendTestSms: "Envoyer un SMS de test",
    sending: "Envoi...",

    saveChanges: "Enregistrer les modifications",

    // Common
    success: "Succès !",
    error: "Erreur",
    send: "Envoyer",
    delete: "Supprimer",
    deleting: "Suppression...",
    selected: "sélectionné(s)",
    deleteConfirmation: "Êtes-vous sûr de vouloir supprimer ce client ?",
    loading: "Chargement...",
    unauthorized: "Non autorisé",

    // Account Management
    account: "Compte",
    accountManagement: "Gestion du compte",
    manageAccountDescription: "Gérez votre profil et vos paramètres de compte",
    profileInformation: "Informations du profil",
    updateProfileDescription: "Mettez à jour votre nom",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "votre@email.com",
    emailChangeNotSupported:
      "Les modifications d'email ne sont pas prises en charge pour le moment",
    dangerZone: "Zone de danger",
    dangerZoneDescription: "Actions irréversibles et destructrices",
    deleteAccount: "Supprimer le compte",
    deleteAccountWarning:
      "Supprimer définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.",
    deleteAccountConfirmTitle: "Êtes-vous absolument sûr ?",
    deleteAccountConfirmMessage:
      "Cela supprimera définitivement votre compte et toutes les données associées. Cette action est irréversible.",
    deleteAccountItem1: "Tous vos clients et rappels seront supprimés",
    deleteAccountItem2: "Votre abonnement sera annulé",
    deleteAccountItem3: "Tous vos paramètres seront perdus",
    deleteAccountItem4: "Votre compte ne peut pas être récupéré",
    deleteAccountWarningFinal:
      "Cette action ne peut pas être annulée. Soyez certain.",
    typeToConfirm: 'Tapez "{text}" pour confirmer',
    deleteAccountPermanently: "Supprimer le compte définitivement",
    profileUpdatedSuccess: "Profil mis à jour avec succès !",
    profileUpdateError: "Erreur lors de la mise à jour du profil",
    accountDeletedSuccess: "Compte supprimé avec succès",
    accountDeleteError: "Erreur lors de la suppression du compte",
    emailAlreadyExists: "Cet email est déjà utilisé",

    // Client Deletion
    deleteClientConfirmTitle: "Supprimer ce client ?",
    deleteClientConfirmMessage:
      'Êtes-vous sûr de vouloir supprimer "{clientName}" ? Cette action ne peut pas être annulée.',
    deleteClientItem1:
      "Tout l'historique des rappels pour ce client sera supprimé",
    deleteClientItem2: "Ce client sera définitivement supprimé de votre liste",
    deleteClientWarningFinal: "Cette action ne peut pas être annulée.",
    deleteClientPermanently: "Supprimer le client définitivement",

    // Bulk Client Deletion
    bulkDeleteConfirmTitle: "Supprimer {count} clients ?",
    bulkDeleteConfirmMessage:
      "Êtes-vous sûr de vouloir supprimer {count} clients ? Cette action ne peut pas être annulée.",
    bulkDeleteItem1:
      "Tous les clients sélectionnés et leur historique de rappels seront supprimés",
    bulkDeleteItem2:
      "Ces clients seront définitivement supprimés de votre liste",
    bulkDeleteWarningFinal: "Cette action ne peut pas être annulée.",
    bulkDeletePermanently: "Supprimer les clients définitivement",

    // Toast Messages
    errorGeneric: "Une erreur s'est produite. Veuillez réessayer.",
    allFieldsRequired: "Tous les champs sont obligatoires",
    clientAddedSuccess: "Client ajouté avec succès !",
    clientAddError: "Erreur lors de l'ajout du client",
    clientUpdatedSuccess: "Client mis à jour avec succès !",
    clientUpdateError: "Erreur lors de la mise à jour du client",
    clientNotFound: "Client introuvable",
    clientDeletedSuccess: "Client supprimé avec succès !",
    clientDeleteError: "Erreur lors de la suppression du client",
    settingsSavedSuccess: "Paramètres enregistrés avec succès !",
    settingsSaveError: "Erreur lors de l'enregistrement des paramètres",
    atLeastOneField: "Au moins un champ doit être fourni",
    testSmsSentSuccess: "SMS de test envoyé avec succès !",
    smsError: "Erreur lors de l'envoi du SMS",
    testSmsError: "Erreur lors de l'envoi du SMS de test",
    reminderSentSuccess: "Rappel envoyé avec succès !",
    reminderSendError: "Erreur lors de l'envoi du rappel",
    signedInSuccess: "Connexion réussie.",
    signInFailed: "Échec de la connexion",
    invalidCredentials: "Email ou mot de passe invalide.",
    accountCreatedSuccess: "Compte créé avec succès.",
    signUpFailed: "Échec de la création du compte",
    emailInUse: "Email déjà utilisé ou une erreur s'est produite.",

    // Tabs
    business: "Entreprise",
    template: "Modèle de SMS",
    twilioConfig: "Fournisseur SMS",
    test: "Test SMS",

    // Pagination
    showing: "Affichage de",
    to: "à",
    of: "sur",
    results: "résultats",
    page: "Page",

    // Import/Export
    importClients: "Importer des clients",
    exportClients: "Exporter des clients",
    importExcel: "Importer Excel",
    exportExcel: "Exporter Excel",
    importFromExcel: "Importer des clients depuis un fichier Excel",
    exportToExcel: "Exporter des clients vers un fichier Excel",
    chooseFile: "Choisir un fichier",
    importing: "Importation...",
    exporting: "Exportation...",
    errorImportingClients: "Erreur lors de l'importation des clients.",
    errorReadingFile: "Erreur lors de la lecture du fichier.",
    errorExportingClients: "Erreur lors de l'exportation des clients.",
    clientsImportedSuccess: "clients importés avec succès !",
    noValidRows:
      "Aucune ligne valide trouvée dans le fichier. Veuillez vérifier le format.",
    excelFormatRequired: "Format Excel requis",
    excelFormatDescription:
      "Name, Email (optional), Phone, Resource, Date (DD/MM/YYYY)",
    excelColumnFlexible:
      "Les noms de colonnes sont flexibles (Portugais ou Anglais)",
    excelPhoneFormat:
      "Formatez la colonne téléphone en Texte pour conserver les zéros de tête (ex : 0612345678)",
    viewExample: "Voir l'exemple",
    hideExample: "Masquer l'exemple",

    // Billing & Subscription
    billing: "Facturation",
    manageBillingDescription: "Gérer votre abonnement et facturation",
    allPlans: "Tous les forfaits",
    upgradeYourPlan: "Mettre à niveau votre forfait",
    bestPlanDescription:
      "Vous êtes sur le meilleur forfait. Gérez votre abonnement sur la gauche.",
    choosePlanDescription: "Choisissez le forfait qui correspond à vos besoins",
    subscription: "Abonnement",
    currentPlan: "Plan Actuel",
    upgradePlan: "Mettre à niveau",
    manageBilling: "Gérer la facturation",
    price: "Prix",
    perMonth: "/mois",
    renewsOn: "Renouvellement le",
    expiresOn: "Expire le",
    active: "Actif",
    pastDue: "Paiement en retard",
    canceledAtPeriodEnd: "Annulé",

    // Plans
    plan: "Plan",
    planFree: "Gratuit",
    planStarter: "Starter",
    planPro: "Pro",

    // Features
    featureImportExport: "Importation/Exportation Excel",
    feature50Clients: "Jusqu'à 50 clients",
    feature100Clients: "Jusqu'à 100 clients",
    featureUnlimitedClients: "Clients illimités",
    featureOwnTwilio: "Utilisez votre propre compte Twilio",
    featureManagedSms: "SMS géré (inclus)",
    featureBasicSupport: "Support de base",
    featurePrioritySupport: "Support prioritaire",
    featurePremiumSupport: "Support premium",
    featureAdvancedTemplates: "Modèles avancés",
    featureCustomBranding: "Marque personnalisée",
    ownTwilio: "Twilio propre",
    managedSms: "SMS géré",
    unlimitedClients: "Clients illimités",
    managedSmsDescription:
      "Laissez-nous gérer l'envoi de SMS pour vous - pas besoin de compte Twilio",
    managedSmsActiveDescription:
      "Nous gérons l'envoi de SMS pour vous. Désactivez pour utiliser votre propre compte Twilio.",
    managedSmsEnabled: "SMS Géré Actif",
    managedSmsEnabledDescription:
      "Nous gérons l'envoi de SMS pour vous. Vos messages seront envoyés via notre infrastructure fiable.",
    noTwilioAccountNeeded: "Pas besoin de compte Twilio",
    autoConfiguration: "Configuration automatique",
    reliableDelivery: "Livraison fiable des messages",

    // Usage Stats
    usageStats: "Statistiques d'utilisation",
    clientUsageTracking: "Suivez votre utilisation des clients",
    clientsUsed: "clients utilisés",
    clientsUsedOf: "sur {total} clients",
    used: "utilisé",
    clientsRemaining: "{remaining} clients restants",
    approachingLimit: "Approche de votre limite",
    considerUpgrading:
      "Envisagez de mettre à niveau pour ajouter plus de clients",
    viewPlans: "Voir les plans",

    // Errors & Messages
    clientLimitReached: "Limite de clients atteinte",
    upgradeToAddMoreClients:
      "Mettez à niveau votre plan pour ajouter plus de clients",
    checkoutError: "Échec de la création de la session de paiement",
    portalError: "Échec de l'ouverture du portail de facturation",
    paymentFailedMessage:
      "Votre paiement a échoué. Veuillez mettre à jour votre méthode de paiement pour continuer à utiliser les fonctionnalités premium.",
    subscriptionCanceledMessage:
      "Votre abonnement sera annulé à la fin de la période de facturation. Vous pouvez le réactiver à tout moment.",
    subscriptionUpdated: "Votre abonnement a été mis à jour avec succès!",
    checkoutCanceled:
      "Le paiement a été annulé. Vous pouvez réessayer à tout moment.",
    contactSales: "Contacter les ventes",
    upgradeToPlan: "Passer à {plan}",
    smsHandling: "Gestion des SMS",
    canceled: "Annulé",

    // Plan Change Dialog
    confirmUpgrade: "Confirmer la mise à niveau",
    confirmDowngrade: "Confirmer la rétrogradation",
    newPlan: "Nouveau forfait",
    whatHappensNext: "Que se passe-t-il ensuite ?",
    proratedChargeExplanation:
      "Vous serez facturé un montant au prorata de la différence",
    immediateAccessExplanation:
      "Vous aurez un accès immédiat à toutes les nouvelles fonctionnalités",
    nextBillingExplanation:
      "Votre prochain cycle de facturation sera au nouveau prix",
    nextBillingLowerPriceExplanation:
      "Votre prochain cycle de facturation sera au prix inférieur",
    paymentRequired: "Paiement de {price} requis",
    monthlyBillingExplanation: "Vous serez facturé mensuellement",
    annualBillingExplanation: "Vous serez facturé annuellement",
    downgradeCreditExplanation:
      "Vous recevrez un crédit au prorata de la différence",
    downgradeFreePortalExplanation:
      "Utilisez le portail de facturation pour annuler votre abonnement",
    downgradeTakesEffectExplanation:
      "Les modifications prennent effet à la fin de votre période de facturation",
    invalidPriceId: "ID de prix invalide",
    newPrice: "Nouveau prix",
    processing: "Traitement en cours...",
    openBillingPortal: "Ouvrir le portail de facturation",
    confirm: "Confirmer",
    downgradePlan: "Rétrograder",
    notAvailable: "Non disponible",

    // Landing Page
    landingHeadline: "Ne manquez jamais une relance",
    landingSubheadline: "Rappels SMS automatiques pour vos clients",
    getStarted: "Commencer",
    privacy: "Confidentialité",
    terms: "Conditions",
    copyright: "© 2025 AutoRemind",
    howItWorks: "Comment ça marche",
    step1Title: "Importez vos clients",
    step1Description:
      "Téléchargez votre base de données clients depuis Excel avec leurs informations et dates de rappel",
    step2Title: "Configurez votre entreprise",
    step2Description:
      "Définissez les informations de votre entreprise et personnalisez votre modèle de SMS",
    step3Title: "Rappels automatiques",
    step3Description:
      "Vos clients recevront automatiquement des rappels SMS avant leurs rendez-vous",

    // Pricing
    pricingTitle: "Tarification simple",
    pricingSubtitle:
      "Commencez gratuitement avec votre Twilio, ou laissez-nous gérer les SMS",
    popular: "Populaire",
    planFreeDescription: "Utilisez votre propre compte Twilio",
    planFreeFeature1: "Jusqu'à 50 clients",
    planFreeFeature2: "Utilisez vos clés Twilio",
    planFreeFeature3: "Import/Export Excel",
    planFreeFeature4: "Support basique",
    planStarterDescription: "Nous gérons les SMS pour vous",
    planStarterFeature1: "Jusqu'à 100 clients",
    planStarterFeature2: "SMS gérés (inclus)",
    planStarterFeature3: "Import/Export Excel",
    planStarterFeature4: "Support prioritaire",
    planProDescription: "Pour les entreprises en croissance",
    planProFeature1: "Clients illimités",
    planProFeature2: "SMS gérés (inclus)",
    planProFeature3: "Import/Export Excel",
    planProFeature4: "Support premium",
    readyToStart: "Prêt à commencer ?",
    readyToStartSubtitle:
      "Commencez à envoyer des rappels SMS automatiques aujourd'hui",
    getStartedFree: "Commencer - C'est Gratuit",

    // Billing Interval
    monthly: "Mensuel",
    annual: "Annuel",
    perYear: "/an",
    billedAnnually: "Facturé annuellement",
    billedMonthly: "Facturé mensuellement",
    switchToAnnual: "Passer à l'Annuel",
    switchToMonthly: "Passer au Mensuel",

    // Hero Visual
    upcomingReminders: "Rappels à venir",
    today: "Aujourd'hui",
    heroClient1Name: "Marie Dupont",
    heroClient1Service: "Contrôle dentaire • 15 Déc",
    heroClient2Name: "Jean Martin",
    heroClient2Service: "Rendez-vous coiffeur • 12 Déc",
    heroClient3Name: "Sophie Bernard",
    heroClient3Service: "Entretien voiture • 10 Déc",
    heroClient4Name: "Pierre Moreau",
    heroClient4Service: "Séance fitness • 18 Déc",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
