import { X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function ApprovalInfoModal({ isOpen, onClose, status, approvalInfo, title }) {
  if (!isOpen) return null;

  const getStatusDisplay = (st) => {
    switch (st) {
      case 'APPROVED':
        return {
          label: 'Đã phê duyệt',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        };
      case 'DENIED':
        return {
          label: 'Từ chối phê duyệt',
          badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
        };
      case 'PENDING':
      default:
        return {
          label: 'Đang chờ AI kiểm duyệt',
          badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <Clock className="w-5 h-5 text-amber-400 animate-spin" />,
        };
    }
  };

  const statusInfo = getStatusDisplay(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-md bg-[#161922] border border-[#2d323f] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d323f]">
          <h3 className="font-semibold text-lg text-[#f3f4f6]">Chi tiết kiểm duyệt</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#9ca3af] hover:text-white rounded-lg hover:bg-[#252a36] transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-xs text-[#9ca3af] uppercase tracking-wider font-medium">Bài viết</span>
            <p className="font-semibold text-[#f3f4f6] line-clamp-2 mt-0.5">{title}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9ca3af] uppercase tracking-wider font-medium">Trạng thái:</span>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.badgeClass}`}>
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
            </div>
          </div>

          {approvalInfo ? (
            <div className="p-4 bg-[#0d0e12] border border-[#2d323f] rounded-xl space-y-2">
              {approvalInfo.approvalNote && (
                <div>
                  <span className="text-xs text-[#9ca3af] font-medium">Ghi chú của hệ thống AI:</span>
                  <p className="text-sm text-[#e5e7eb] mt-1 whitespace-pre-line leading-relaxed">
                    {approvalInfo.approvalNote}
                  </p>
                </div>
              )}
              {approvalInfo.approvedAt && (
                <div className="pt-2 border-t border-[#2d323f]/60 text-xs text-[#9ca3af]">
                  Thời gian xử lý: {new Date(approvalInfo.approvedAt).toLocaleString('vi-VN')}
                </div>
              )}
            </div>
          ) : status === 'PENDING' ? (
            <p className="text-sm text-[#9ca3af] italic">
              Bài viết của bạn vừa được khởi tạo và đang được gửi đến hàng đợi AI kiểm duyệt nội dung tự động. Kết quả sẽ được cập nhật sớm nhất.
            </p>
          ) : (
            <p className="text-sm text-[#9ca3af] italic">Không có thêm ghi chú kiểm duyệt.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#11131a] border-t border-[#2d323f] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#f3f4f6] bg-[#252a36] hover:bg-[#2d323f] rounded-xl transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
