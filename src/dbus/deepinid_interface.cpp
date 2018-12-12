/*
 * This file was generated by qdbusxml2cpp-fix version 0.8
 * Command line was: qdbusxml2cpp-fix -c deepinid -p generated/com_deepin_deepinid /home/iceyer/Develop/deepin/dde-qt-dbus-factory/xml/com.deepin.deepinid.xml
 *
 * qdbusxml2cpp-fix is Copyright (C) 2016 Deepin Technology Co., Ltd.
 *
 * This is an auto-generated file.
 * This file may have been hand-edited. Look for HAND-EDIT comments
 * before re-generating it.
 */

#include "deepinid_interface.h"

/*
 * Implementation of interface class __deepinid
 */

class __deepinidPrivate
{
public:
    __deepinidPrivate() = default;

    // begin member variables
    QString HardwareID;
    QString MachineName;
    DVariantMap UserInfo;

public:
    QMap<QString, QDBusPendingCallWatcher *> m_processingCalls;
    QMap<QString, QList<QVariant>> m_waittingCalls;
};

__deepinid::__deepinid(const QString &service, const QString &path, const QDBusConnection &connection, QObject *parent)
    : DBusExtendedAbstractInterface(service, path, staticInterfaceName(), connection, parent)
    , d_ptr(new __deepinidPrivate)
{
    connect(this, &__deepinid::propertyChanged, this, &__deepinid::onPropertyChanged);

    if (QMetaType::type("DVariantMap") == QMetaType::UnknownType) {
        qRegisterMetaType<DVariantMap>("DVariantMap");
        qDBusRegisterMetaType<DVariantMap>();
    }
}

__deepinid::~__deepinid()
{
    qDeleteAll(d_ptr->m_processingCalls.values());
    delete d_ptr;
}

void __deepinid::onPropertyChanged(const QString &propName, const QVariant &value)
{
    if (propName == QStringLiteral("HardwareID")) {
        const QString &HardwareID = qvariant_cast<QString>(value);
        if (d_ptr->HardwareID != HardwareID) {
            d_ptr->HardwareID = HardwareID;
            Q_EMIT HardwareIDChanged(d_ptr->HardwareID);
        }
        return;
    }

    if (propName == QStringLiteral("MachineName")) {
        const QString &MachineName = qvariant_cast<QString>(value);
        if (d_ptr->MachineName != MachineName) {
            d_ptr->MachineName = MachineName;
            Q_EMIT MachineNameChanged(d_ptr->MachineName);
        }
        return;
    }

    if (propName == QStringLiteral("UserInfo")) {
        const DVariantMap &UserInfo = qvariant_cast<DVariantMap>(value);
        if (d_ptr->UserInfo != UserInfo) {
            d_ptr->UserInfo = UserInfo;
            Q_EMIT UserInfoChanged(d_ptr->UserInfo);
        }
        return;
    }

    qWarning() << "property not handle: " << propName;
    return;
}

QString __deepinid::hardwareID()
{
    return qvariant_cast<QString>(internalPropGet("HardwareID", &d_ptr->HardwareID));
}

QString __deepinid::machineName()
{
    return qvariant_cast<QString>(internalPropGet("MachineName", &d_ptr->MachineName));
}

DVariantMap __deepinid::userInfo()
{
    return qvariant_cast<DVariantMap>(internalPropGet("UserInfo", &d_ptr->UserInfo));
}

void __deepinid::CallQueued(const QString &callName, const QList<QVariant> &args)
{
    if (d_ptr->m_waittingCalls.contains(callName)) {
        d_ptr->m_waittingCalls[callName] = args;
        return;
    }
    if (d_ptr->m_processingCalls.contains(callName)) {
        d_ptr->m_waittingCalls.insert(callName, args);
    } else {
        QDBusPendingCallWatcher *watcher = new QDBusPendingCallWatcher(asyncCallWithArgumentList(callName, args));
        connect(watcher, &QDBusPendingCallWatcher::finished, this, &__deepinid::onPendingCallFinished);
        d_ptr->m_processingCalls.insert(callName, watcher);
    }
}

void __deepinid::onPendingCallFinished(QDBusPendingCallWatcher *w)
{
    w->deleteLater();
    const auto callName = d_ptr->m_processingCalls.key(w);
    Q_ASSERT(!callName.isEmpty());
    if (callName.isEmpty()) {
        return;
    }
    d_ptr->m_processingCalls.remove(callName);
    if (!d_ptr->m_waittingCalls.contains(callName)) {
        return;
    }
    const auto args = d_ptr->m_waittingCalls.take(callName);
    CallQueued(callName, args);
}
